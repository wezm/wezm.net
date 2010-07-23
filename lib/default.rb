# All files in the 'lib' directory will be loaded
# before nanoc starts compiling.

require 'json'

include Nanoc3::Helpers::Rendering
include Nanoc3::Helpers::Blogging
include Nanoc3::Helpers::XMLSitemap
include Nanoc3::Helpers::HTMLEscape
include WezM::Helpers::Articles
