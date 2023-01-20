+++
title = "Hide Sign in With Google Pop Up"
date = 2023-01-20T20:48:02+10:00

#[extra]
#updated = 2023-01-11T21:11:28+10:00
+++

Inspired by
[Rach Smith's post on using userstyles to hide YouTube shorts][rachsmith]
I came up with some CSS to hide those
annoying Sign in with Google pop-ups. 

<!-- more -->

I never want to sign in with Google and use [Firefox Multi-Account Containers][containers]
to ensure that the bulk of my browsing is done without ever being
signed in to a Google account. This means that I see a lot of these pop ups
encouraging me to sign in, so Google can track me more.

{{ figure_no(image="posts/2023/hide-sign-in-with-google/sign-in-with-google.png", border=true, width=357, alt="Screenshot of the pop up", caption="Be gone evil pop up") }}

I use [Stylus] to manage user styles. I created a new rule that applies to all
sites and put this CSS in there:

```css
#credential_picker_container:has(iframe[src*="accounts.google.com"]) {
    display: none;
}
```

Note that it uses the [`:has`][has] selector, which is not on by default in Firefox
at the time of writing. In Firefox 103 onwards you can enable it by toggling
`layout.css.has-selector.enabled` (the usual caveats about poking around in
[`about:config`][about-config] apply).

If you do browse while signed in to a Google account, Aranjedeath on the Fediverse
pointed out that [you can turn them off in your account settings][Aranjedeath].

[containers]: https://support.mozilla.org/en-US/kb/containers
[Aranjedeath]: https://hachyderm.io/@Aranjedeath/109720032830494381
[rachsmith]: https://rachsmith.com/remove-youtube-shorts/
[Stylus]: https://github.com/openstyles/stylus
[about-config]: https://support.mozilla.org/en-US/kb/about-config-editor-firefox
[has]: https://developer.mozilla.org/en-US/docs/Web/CSS/:has