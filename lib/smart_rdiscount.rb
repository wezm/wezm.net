module WezM::Filters
  class SmartRDiscount < Nanoc3::Filter
    def run(content, params={})
      require 'rdiscount'

      markdown = ::RDiscount.new(content)
      markdown.smart = true
      markdown.to_html
    end
  end
end

Nanoc3::Filter.register '::WezM::Filters::SmartRDiscount', :smart_rdiscount
