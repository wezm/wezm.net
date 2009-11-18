require 'nokogiri'
require 'nanoc3'

module Importer

  class Wordpress

    def initialize(wordpress_export_path, nanoc_site_path)
      @export_file = File.open(wordpress_export_path)
      @export = Nokogiri::XML(@export_file)
      @site = Nanoc3::Site.new(nanoc_site_path)
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

    def get(node, xpath)
      elem = node.xpath(xpath).first
      elem ? elem.content : nil
    end

    def process_post(post)
      puts "Processing post: #{post.css('title').first.text}"
      content = get(post, 'content:encoded')

      tags = []
      post.css('category[domain=tag]').each do |tag|
        if tag['nicename']
          tags << tag['nicename']
        else
          tags << tag.text.downcase
        end
      end

      categories = []
      post.css('category[domain=category]').each do |category|
        categories << category.text
      end

      attributes = {
        :tags => tags.uniq,
        :categories => categories.uniq,
        :permalink => get(post, 'link'),
        :status => get(post, 'wp:status'),
        :slug => get(post, 'wp:post_name'),
        :post_id => get(post, 'wp:post_id').to_i,
        :post_date => get(post, 'wp:post_date_gmt'),
      }

      unless attributes[:slug]
        puts "Error post #{post_id} has no slug"
        return
      end

      path = "/articles/#{slug}"
      add_item(content, attributes, identifier)
    end

    def process_page(page)
      puts "Processing page: #{page.css('title').first.text}"
    end

    def process_attachment(attachment)
      puts "Processing attachment"
    end

    def add_item(content, attributes, identifier)
      # content = row['post_content']
      # attributes = {
      #   :title        => row['post_title'],
      #   :published_on => row['post_date_gmt'],
      #   :modified_on  => row['post_modified_gmt'],
      #   :status       => row['post_status'],
      #   :excerpt      => row['post_excerpt']
      # }
      # identifier = '/posts/' + post_date.year.to_s + '/' + post_date.month.to_s + '/' + post_name + '/'
      @site.data_sources.first.create_item(content, attributes, identifier)
      puts "Added item at #{identifier}"
    end

  end

end
