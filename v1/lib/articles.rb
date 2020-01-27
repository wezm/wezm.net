require 'rubypants'

module WezM
  module Helpers
    module Articles
      
      def personal_articles
        sorted_articles.select { |a| a.identifier =~ %r{^/personal/} }
      end

      def technical_articles
        sorted_articles.select { |a| a.identifier =~ %r{^/technical/} }
      end

      def article_to_json(article)
        {
          :title => RubyPants.new(article[:title]).to_html,
          :path => article.identifier,
          :date => Time.parse(article[:created_at]).rfc2822,
          :text => RubyPants.new(article[:title]).to_html,
          :extra => RubyPants.new(article[:extra] || " ").to_html
        }
      end

      def short_url(url)
        require 'bitly'
        begin
          @bitly ||= Bitly.new('wezm', 'R_f2bfdace56c886671086eb0c8acb9ce7')
          @cache ||= {}
          unless u = @cache[url]
            u = @bitly.shorten(url)
          else
            puts "Cache hit on #{url}"
          end
          u.short_url
        rescue BitlyError
          nil
        end
      end

    end
  end
end
