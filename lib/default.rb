# All files in the 'lib' directory will be loaded
# before nanoc starts compiling.

require 'json'
require 'rouge'

include Nanoc::Helpers::Rendering
include Nanoc::Helpers::Blogging
include Nanoc::Helpers::XMLSitemap
include Nanoc::Helpers::HTMLEscape
include WezM::Helpers::Articles
