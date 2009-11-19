require 'rubygems'

require 'wordpress'

if ARGV.size < 3
  puts "Usage importer.rb worpress-export.xml /path/to/nanoc/site /path/to/rewrite_map"
  exit 3
end

i = Importer::Wordpress.new(ARGV[0], ARGV[1], ARGV[2])

i.run
