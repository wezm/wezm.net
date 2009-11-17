require 'rubygems'

require 'wordpress'

i = Importer::Wordpress.new('wezm.net.2009-11-17.xml')

i.run
