require 'rubygems'

require 'wordpress'

if ARGV.size < 2
  puts "Usage importer.rb worpress-export.xml /path/to/nanoc/site"
  exit 3
end

i = Importer::Wordpress.new(ARGV[0], ARGV[1])

i.run
