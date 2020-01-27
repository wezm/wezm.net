require 'time'

module WezM
  module Helpers

    def self.parse_post_date(article)
      article[:created_at]
    end

  end
end
