require 'nokogiri'
require 'nanoc3'
require 'uri'

module Importer

  class Wordpress

    def initialize(wordpress_export_path, nanoc_site_path, rewrite_map_path)
      @export_file = File.open(wordpress_export_path)
      @export = Nokogiri::XML(@export_file)
      @site = Nanoc3::Site.new(nanoc_site_path)
      @rewrite_map = []
      @rewrite_map_path = rewrite_map_path

      load_categories
      load_tags
    end

    def load_categories
      puts "Loading categories"
      @categories = {}
      @export.xpath('//rss/channel/wp:category').each do |category|
        name = get(category, 'wp:cat_name')
        parent = get(category, 'wp:category_parent')
        parent = nil if parent.empty?
        @categories[name] = {
          :slug => get(category, 'wp:category_nicename'),
          :name => name,
          :parent => parent
        }
      end
    end

    def load_tags
      puts "Loading tags"
      @tags = {}
      @export.xpath('//rss/channel/wp:tag').each do |tag|
        slug = get(tag, 'wp:tag_slug')
        @tags[slug] = {
          :slug => slug,
          :name => get(tag, 'wp:tag_name'),
        }
      end
    end

    def find_topmost_category(category)
      return category if category[:parent].nil?
      find_topmost_category(@categories[category[:parent]])
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
      write_rewrite_map
    end

    protected

    def get(node, xpath)
      elem = node.at_xpath(xpath)
      elem ? elem.content : nil
    end

    def process_post(post)
      puts "Processing post: #{post.at_css('title').text}"
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
      categories.uniq!

      begin
        post_date = Date.strptime(get(post, 'wp:post_date_gmt'), "%Y-%m-%d %H:%M:%S")
      rescue ArgumentError
        post_date = Date.today
      end

      attributes = {
        :tags => tags.uniq,
        :categories => categories,
        :permalink => get(post, 'link'),
        :status => get(post, 'wp:status'),
        :slug => get(post, 'wp:post_name'),
        :post_id => get(post, 'wp:post_id').to_i,
        :section => find_topmost_category(@categories[categories.first])[:slug],
        :title => get(post, 'title'),
        :created_at => get(post, 'wp:post_date_gmt'),
      }
      attributes[:kind] = attributes[:status] == 'publish' ? 'article' : 'draft'

      if attributes[:slug].empty?
        puts "WARNING: Error post #{attributes[:post_id]} has no slug, generating one"
        attributes[:slug] = attributes[:title].downcase.gsub(/[^0-9a-zA-Z]/, '-').gsub(/-{2,}/, '-')
      end

      path = ['', attributes[:section], post_date.year, ("%02d" % post_date.month), attributes[:slug], ''].join('/')

      # require 'pp'
      # pp attributes

      add_item(content, attributes, path)
    end

    def process_page(page)
      puts "WARNING: Skipping page: #{page.at_css('title').text}"
    end

    def process_attachment(attachment)
      # puts "Processing attachment"
      # Don't need these for now
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
      if attributes[:status] == 'publish'
        @rewrite_map << [attributes[:permalink], identifier]
      end
      @site.data_sources.first.create_item(content, attributes, identifier)
      puts "Added item at #{identifier}"
    end

    def write_rewrite_map
      File.open(@rewrite_map_path, 'w') do |f|
        @rewrite_map.each do |old_url, new_path|
          uri = URI.parse(old_url)
          f.puts uri.path + "\t" + new_path
          puts uri.path + " => " + new_path
        end
      end
    end

  end

end
