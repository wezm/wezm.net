require 'time'

module WezM
  module Helpers

    def self.parse_post_date(article)
      Time.parse(article[:created_at])
    end

  end
end
