require 'rbconfig'

source 'https://rubygems.org'

gem 'rake'
gem 'mime-types'
gem 'nanoc', '~> 4.0'
gem 'bitly'
gem 'haml'
gem 'sass'
gem 'rdiscount'
gem 'rubypants'
gem 'nokogiri'
gem 'builder'
gem 'fssm'
gem 'systemu'
gem 'listen'
gem 'adsf'
gem 'rouge'

group :development do
  gem 'guard-nanoc'
  if RbConfig::CONFIG['target_os'] =~ /(?i-mx:bsd|dragonfly)/
    gem 'rb-kqueue', '>= 0.2'
  end
end
