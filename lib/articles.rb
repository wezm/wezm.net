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
          :title => article[:title],
          :path => article.identifier,
        }
      end

    end
  end
end