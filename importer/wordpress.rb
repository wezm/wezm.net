require 'nokogiri'
require 'nanoc3'

module Importer
  
  class Wordpress

    def initialize(wordpress_export_path)
      @export_file = File.open(wordpress_export_path)
      @export = Nokogiri::XML(@export_file)
    end

    def run
      # Loop over each post
      @export.xpath('//rss/channel/item').each do |item|
        item_type = item.xpath('wp:post_type').first.text
        case item_type
        when 'post'
          process_post(item)
        when 'page'
          process_page(item)
        when 'attachment'
          process_attachment(item)
        else
          puts "Unknown post type: #{item_type}"
        end
      end
    end

    protected

    def process_post(post)
      puts "Processing post: #{post.css('title').first.text}"
    end
    
    def process_page(page)
      puts "Processing page: #{page.css('title').first.text}"
    end

    def process_attachment(attachment)
      puts "Processing attachment"
    end

  end
  
end
