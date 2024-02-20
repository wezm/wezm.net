+++
title = "systemd-sysusers and Chimera Linux"
date = 2023-12-18T11:25:57+10:00

#[extra]
#updated = 2023-01-11T21:11:28+10:00
+++

I use [Chimera Linux] as the primary OS on my laptop (as opposed to my desktop,
which is still running Arch Linux for now). Chimera was created in 2021 and
reached alpha status in June 2023. Chimera was built from scratch and as the
name suggests it comprised of a motley crew of components:

- Kernel: [Linux]
- Toolchain: [LLVM]
- libc: [Musl] with [Scudo allocator][scudo]
- Core userland: [FreeBSD (with some NetBSD and OpenBSD too)][chimerautils]
- Init: [Dinit]
- Package manager: [apk][apktools]
- Package builder: [cbuild]

The project and its development is proving very useful to me for seeing how a
Linux distribution is built and evolved over time. Watching it progress (and
helping a little by [maintaining some packages][maintainer]) has helped expose
some lesser known (to me) components that make up a typical Linux system, and
their role.

Recently [systemd-sysusers] was introduced. Some folks might find this
surprising as Chimera does not use systemd for the role of pid 1/init. As
mentioned above it uses [Dinit] for this. Some standalone parts of systemd are
used though. Currently:

- `udev`
- `systemd-tmpfiles`
- and now, `systemd-sysusers`

I had not encountered `systemd-sysusers` previously (even though it's probably
used on the systemd based distros I've used before), so I thought I'd jot down
what I learned about it and how it's used (at the time of writing) in Chimera.

<!-- more -->

### What is systemd-sysusers?

As the name implies `systemd-sysusers` is designed to make managing system
users (and groups) easier. System users are users that a typically created for
system processes to use for privilege separation. For example, the CUPS
printing system runs as the `_cups` user.

In [the commit that introduced sysusers][systemd-commit] into systemd Lennart
Poettering included this description:

> systemd-sysusers is a tool to reconstruct /etc/passwd and /etc/group
> from static definition files that take a lot of inspiration from
> tmpfiles snippets. These snippets should carry information about system
> users only. To make sure it is not misused for normal users these
> snippets only allow configuring UID and gecos field for each user, but
> do not allow configuration of the home directory or shell, which is
> necessary for real login users.
> 
> The purpose of this tool is to enable state-less systems that can
> populate /etc with the minimal files necessary, solely from static data
> in /usr. systemd-sysuser is additive only, and will never override
> existing users.
> 
> This tool will create these files directly, and not via some user
> database abtsraction layer. This is appropriate as this tool is supposed
> to run really early at boot, and is only useful for creating system
> users, and system users cannot be stored in remote databases anyway.
> 
> The tool is also useful to be invoked from RPM scriptlets, instead of
> useradd. This allows moving from imperative user descriptions in RPM to
> declarative descriptions.
> 
> The UID/GID for a user/group to be created can either be chosen dynamic,
> or fixed, or be read from the owner of a file in the file system, in
> order to support reconstructing the correct IDs for files that shall be
> owned by them.
> 
> This also adds a minimal user definition file, that should be
> sufficient for most basic systems. Distributions are expected to patch
> these files and augment the contents, for example with fixed UIDs for
> the users where that's necessary.

Chimera is using it for the scenario described for RPM. Specifically
snippets in `/usr/lib/sysusers.d` are used to describe the system
users and groups that should exist.

### systemd-sysusers in Chimera Linux

Before the introduction of `systemd-sysusers` packages declared system users
and groups that were required in the package `template.py` and [`cbuild` would
generate scripts][scriptlets] from a template that added the users and groups,
as well as disable them when packages are uninstalled. These scripts had to
handle things like the user/group already existing, tools for adding users or
groups missing, failures creating users/groups, etc.

The generated scripts were then embedded into the final apk package as scripts
tied to "pre-install", "pre-upgrade", and "post-deinstall" actions.

For example, here is the scripts section (formatted by `adbdump` as YAML) for the
`chrony` NTP client/server:

```yaml
scripts:
  pre-install: |
    #!/bin/sh
    
    _chrony_homedir=/var/lib/chrony
    system_users=_chrony
    
    _system_accounts_invoke() {
    
        local USERADD USERMOD
    
        [ -z "$system_users" -a -z "$system_groups" ] && return 0
    
        if command -v useradd >/dev/null 2>&1; then
            USERADD="useradd"
        fi
    
        if command -v usermod >/dev/null 2>&1; then
            USERMOD="usermod"
        fi
    
        show_acct_details() {
            echo "   Account: $1"
            echo "   Description: '$2'"
            echo "   Homedir: '$3'"
            echo "   Shell: '$4'"
            [ -n "$5" ] && echo "   Additional groups: '$5'"
        }
    
        group_add() {
            local _pretty_grname _grname _gid
    
            if ! command -v groupadd >/dev/null 2>&1; then
                echo "WARNING: cannot create $1 system group (missing groupadd)"
                echo "The following group must be created manually: $1"
                return 0
            fi
    
            _grname="${1%:*}"
            _gid="${1##*:}"
    
            [ "${_grname}" = "${_gid}" ] && _gid=
    
            _pretty_grname="${_grname}${_gid:+ (gid: ${_gid})}"
    
            groupadd -r ${_grname} ${_gid:+-g ${_gid}} >/dev/null 2>&1
    
            case $? in
                0) echo "Created ${_pretty_grname} system group." ;;
                9) ;;
                *) echo "ERROR: failed to create system group ${_pretty_grname}!"; return 1;;
            esac
    
            return 0
        }
    
        # System groups required by a package.
        for grp in ${system_groups}; do
            group_add $grp || return 1
        done
    
        # System user/group required by a package.
        for acct in ${system_users}; do
            _uname="${acct%:*}"
            _uid="${acct##*:}"
    
            [ "${_uname}" = "${_uid}" ] && _uid=
    
            eval homedir="\$${_uname}_homedir"
            eval shell="\$${_uname}_shell"
            eval descr="\$${_uname}_descr"
            eval groups="\$${_uname}_groups"
            eval pgroup="\$${_uname}_pgroup"
    
            [ -z "$homedir" ] && homedir="/var/empty"
            [ -z "$shell" ] && shell="/usr/bin/nologin"
            [ -z "$descr" ] && descr="${_uname} user"
            [ -n "$groups" ] && user_groups="-G $groups"
    
            if [ -n "${_uid}" ]; then
                use_id="-u ${_uid} -g ${pgroup:-${_uid}}"
                _pretty_uname="${_uname} (uid: ${_uid})"
            else
                use_id="-g ${pgroup:-${_uname}}"
                _pretty_uname="${_uname}"
            fi
    
            if [ -z "$USERADD" -o -z "$USERMOD" ]; then
                echo "WARNING: cannot create ${_uname} system account (missing useradd or usermod)"
                echo "The following system account must be created:"
                show_acct_details "${_pretty_uname}" "${descr}" "${homedir}" "${shell}" "${groups}"
                continue
            fi
    
            group_add ${pgroup:-${acct}} || return 1
    
            ${USERADD} -c "${descr}" -d "${homedir}" \
                ${use_id} ${pgroup:+-N} -s "${shell}" \
                ${user_groups} -r ${_uname} >/dev/null 2>&1
    
            case $? inhttps://github.com/systemd/systemd/commit/1b99214789101976d6bbf75c351279584b071998
                0)
                    echo "Created ${_pretty_uname} system user."
                    ${USERMOD} -L ${_uname} >/dev/null 2>&1
                    if [ $? -ne 0 ]; then
                        echo "WARNING: unable to lock password for ${_uname} system account"
                    fi
                    ;;
                9)
                    ${USERMOD} -c "${descr}" -d "${homedir}" \
                        -s "${shell}" -g "${pgroup:-${_uname}}" \
                        ${user_groups} ${_uname} >/dev/null 2>&1
                    if [ $? -eq 0 ]; then
                        echo "Updated ${_uname} system user."
                    else
                        echo "WARNING: unable to modify ${_uname} system account"
                        echo "Please verify that account is compatible with these settings:"
                        show_acct_details "${_pretty_uname}" \
                            "${descr}" "${homedir}" "${shell}" "${groups}"
                        continue
                    fi
                    ;;
                *)
                    echo "ERROR: failed to create system user ${_pretty_uname}!"
                    return 1
                    ;;
            esac
        done
        return 0
    }
    _system_accounts_invoke 'chrony' '4.4' || exit $?
  post-deinstall: |
    #!/bin/sh
    
    _chrony_homedir=/var/lib/chrony
    system_users=_chrony
    
    _system_accounts_invoke() {
    
        local USERMOD
    
        [ -z "$system_users" ] && return 0
    
        if command -v usermod >/dev/null 2>&1; then
            USERMOD="usermod"
        fi
    
        for acct in ${system_users}; do
            _uname="${acct%:*}"
    
            comment="$( (getent passwd "${_uname}" | cut -d: -f5 | head -n1) 2>/dev/null )"
            comment="${comment:-user} - removed package ${1}"
    
            if [ -z "$USERMOD" ]; then
                echo "WARNING: cannot disable ${_uname} system user (missing usermod)"
                continue
            fi
    
            ${USERMOD} -L -d /var/empty -s /usr/bin/false \
                -c "${comment}" ${_uname} >/dev/null 2>&1
            if [ $? -eq 0 ]; then
                echo "Disabled ${_uname} system user."
            fi
        done
        return 0
    }
    _system_accounts_invoke 'chrony' '4.4' || exit $?
  pre-upgrade: |
    #!/bin/sh
    
    _chrony_homedir=/var/lib/chrony
    system_users=_chrony
    
    _system_accounts_invoke() {
    
        local USERADD USERMOD
    
        [ -z "$system_users" -a -z "$system_groups" ] && return 0
    
        if command -v useradd >/dev/null 2>&1; then
            USERADD="useradd"
        fi
    
        if command -v usermod >/dev/null 2>&1; then
            USERMOD="usermod"
        fi
    
        show_acct_details() {
            echo "   Account: $1"
            echo "   Description: '$2'"
            echo "   Homedir: '$3'"
            echo "   Shell: '$4'"
            [ -n "$5" ] && echo "   Additional groups: '$5'"
        }
    
        group_add() {
            local _pretty_grname _grname _gid
    
            if ! command -v groupadd >/dev/null 2>&1; then
                echo "WARNING: cannot create $1 system group (missing groupadd)"
                echo "The following group must be created manually: $1"
                return 0
            fi
    
            _grname="${1%:*}"
            _gid="${1##*:}"
    
            [ "${_grname}" = "${_gid}" ] && _gid=
    
            _pretty_grname="${_grname}${_gid:+ (gid: ${_gid})}"
    
            groupadd -r ${_grname} ${_gid:+-g ${_gid}} >/dev/null 2>&1
    
            case $? in
                0) echo "Created ${_pretty_grname} system group." ;;
                9) ;;
                *) echo "ERROR: failed to create system group ${_pretty_grname}!"; return 1;;
            esac
    
            return 0
        }
    
        # System groups required by a package.
        for grp in ${system_groups}; do
            group_add $grp || return 1
        done
    
        # System user/group required by a package.
        for acct in ${system_users}; do
            _uname="${acct%:*}"
            _uid="${acct##*:}"
    
            [ "${_uname}" = "${_uid}" ] && _uid=
    
            eval homedir="\$${_uname}_homedir"
            eval shell="\$${_uname}_shell"
            eval descr="\$${_uname}_descr"
            eval groups="\$${_uname}_groups"
            eval pgroup="\$${_uname}_pgroup"
    
            [ -z "$homedir" ] && homedir="/var/empty"
            [ -z "$shell" ] && shell="/usr/bin/nologin"
            [ -z "$descr" ] && descr="${_uname} user"
            [ -n "$groups" ] && user_groups="-G $groups"
    
            if [ -n "${_uid}" ]; then
                use_id="-u ${_uid} -g ${pgroup:-${_uid}}"
                _pretty_uname="${_uname} (uid: ${_uid})"
            else
                use_id="-g ${pgroup:-${_uname}}"
                _pretty_uname="${_uname}"
            fi
    
            if [ -z "$USERADD" -o -z "$USERMOD" ]; then
                echo "WARNING: cannot create ${_uname} system account (missing useradd or usermod)"
                echo "The following system account must be created:"
                show_acct_details "${_pretty_uname}" "${descr}" "${homedir}" "${shell}" "${groups}"
                continue
            fi
    
            group_add ${pgroup:-${acct}} || return 1
    
            ${USERADD} -c "${descr}" -d "${homedir}" \
                ${use_id} ${pgroup:+-N} -s "${shell}" \
                ${user_groups} -r ${_uname} >/dev/null 2>&1
    
            case $? in
                0)
                    echo "Created ${_pretty_uname} system user."
                    ${USERMOD} -L ${_uname} >/dev/null 2>&1
                    if [ $? -ne 0 ]; then
                        echo "WARNING: unable to lock password for ${_uname} system account"
                    fi
                    ;;
                9)
                    ${USERMOD} -c "${descr}" -d "${homedir}" \
                        -s "${shell}" -g "${pgroup:-${_uname}}" \
                        ${user_groups} ${_uname} >/dev/null 2>&1
                    if [ $? -eq 0 ]; then
                        echo "Updated ${_uname} system user."
                    else
                        echo "WARNING: unable to modify ${_uname} system account"
                        echo "Please verify that account is compatible with these settings:"
                        show_acct_details "${_pretty_uname}" \
                            "${descr}" "${homedir}" "${shell}" "${groups}"
                        continue
                    fi
                    ;;
                *)
                    echo "ERROR: failed to create system user ${_pretty_uname}!"
                    return 1
                    ;;
            esac
        done
        return 0
    }
    _system_accounts_invoke 'chrony' '4.4' || exit $?
```

As you can see this not super pretty and the "pre-install" & "pre-upgrade" scripts are
duplicated.

Enter `systemd-sysusers`. Now the `chrony` package includes a file
`sysusers.conf`, which is installed into `/usr/lib/sysusers.d/chrony.conf` when the package
is installed:

```
# Create chrony system user

u _chrony - "chrony user" /var/lib/chrony /usr/bin/nologin
```

When building the package `cbuild` detects the presence of a file installed
into `usr/lib/sysusers.d` and adds a runtime dependency on the `systemd-utils`
package, which contains the `systemd-sysusers` binary.

In turn, the `systemd-utils` package contains a trigger.
[Triggers][cports-triggers] are a concept built into the `apk` package manager.
A package can have one trigger script that is run whenever a package changes
the contents of a "monitored" directory. In this case the `systemd-utils`
trigger is run whenever `/usr/lib/syusers.d` or `/usr/lib/tmpfiles.d` changes
(`systemd-tmpfiles` is a story for another day).

As far as the `systemd-sysusers` part of the trigger script is concerned it
runs `/usr/bin/systemd-sysusers`, which uses the declarative contents of
`/usr/lib/syusers.d` to determine what system users and groups should exist and
be active, then makes changes as needed.

This is the `adbdump` of `systemd-utils-254-r5.44c71395.apk` showing the
trigger script and its monitored directories:

```yaml
scripts:
  trigger: |
    #!/bin/sh

    # package script
    set -e

    # invoking sysusers is always harmless
    /usr/bin/systemd-sysusers || :

    # always create/remove/set
    TMPFILES_ARGS="--create --remove"

    # a little heuristical but unassuming with userland
    # the idea is that if /run is mounted, it's probably a running system
    # (doesn't matter if container or real) and has pseudo-filesystems
    # in place, otherwise we avoid messing with them
    if [ ! -r /proc/self/mounts -o ! -x /usr/bin/awk ]; then
        # bare system, don't mess with pseudofs
        TMPFILES_ARGS="$TMPFILES_ARGS -E"
    else
        RUN_FSTYPE=$(/usr/bin/awk '{if ($2 == "/run") print $1;}' /proc/self/mounts)
        RUN_FSTYPE=$(/usr/bin/awk '{if ($2 == "/run") print $1;}' /proc/self/mounts)
        if [ "$RUN_FSTYPE" != "tmpfs" ]; then
            # /run is not mounted or is something bad, don't mess with pseudofs
            TMPFILES_ARGS="$TMPFILES_ARGS -E"
        fi
    fi

    /usr/bin/systemd-tmpfiles $TMPFILES_ARGS || :
triggers: # 2 items
  - /usr/lib/sysusers.d
  - /usr/lib/tmpfiles.d

```

As you can see individual packages are now much simpler and all the complexity
of managing the system users and groups is delegated to `systemd-sysusers`.

An added benefit of the removal of hook scripts is package actions (such as
add/delete) become more atomic. For example if a "pre-install" hook script is
run and makes changes, then the install step fails the changes made by the
script will not be rolled back. In contrast trigger scripts are only run after
the package action has successfully been committed. If something fails during
the package action the transaction will be rolled back before any scripts are
run.

### Wrap Up

I found learning about this change valuable for better understanding how a
hidden aspect of package management works, I hope you did too. If you'd like to
see more posts like this feel free to let me know.

[cports-triggers]: https://github.com/chimera-linux/cports/blob/2ff6e8bdd6e3e5f6663f0aa19200f7ce75d84cc2/Packaging.md#hooks-and-triggers
[Dinit]: https://davmac.org/projects/dinit/
[systemd-sysusers]: https://www.freedesktop.org/software/systemd/man/latest/systemd-sysusers.html
[chimerautils]: https://github.com/chimera-linux/chimerautils
[LLVM]: https://llvm.org/
[Musl]: https://musl.libc.org/
[scudo]: https://releases.llvm.org/17.0.1/docs/ScudoHardenedAllocator.html
[apktools]: https://gitlab.alpinelinux.org/alpine/apk-tools
[cbuild]: https://github.com/chimera-linux/cports/blob/e11b91cfa66cc5c45657de4b33215ccdff51b1b7/Usage.md
[Chimera Linux]: https://chimera-linux.org/
[Linux]: https://www.kernel.org/
[maintainer]: https://pkgs.chimera-linux.org/packages?name=&arch=x86_64&origin=&maintainer=Wesley+Moore
[systemd-commit]: https://github.com/systemd/systemd/commit/1b99214789101976d6bbf75c351279584b071998
[scriptlets]: https://github.com/chimera-linux/cports/blob/8973e62759641602e29a8cb2b639dc886731ab49/src/cbuild/hooks/pre_pkg/099_scriptlets.py
