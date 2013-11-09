class Webink

  CONFIG = {
    :project => 'C5BD26AA-1512-4AB5-9747-5B1AFB64DFDA',
    :fonts => {
      'FB1E928A-046A-0390-A052-593A536E0BEF' => {
        :family => 'CamingoWeb',
        :style  => :italic,
        :weight => 300,
      },
      'C67B3481-FFC9-D963-DE85-A940D8C283F0' => {
        :family => 'CamingoWeb',
        :weight => 900,
        :enabled => false,
      },
      '424444D2-FE05-E607-206A-78F66DD6295A' => {
        :family => 'CamingoWeb',
        :style  => :italic,
        :weight => 800,
        :enabled => false,
      },
      '9C441ADD-B49A-E1A3-33A7-F379C630021E' => {
        :family => 'CamingoWeb',
        :style  => :italic,
        :weight => 400,
      },
      'BDB31855-922B-4214-CF34-B35893938F0A' => {
        :family => 'CamingoWeb',
        :weight => 200,
      },
      '0E16AB2A-5E12-085F-01E7-69EBCA83E970' => {
        :family => 'CamingoWeb',
        :weight => 800,
        :enabled => false,
      },
      '0A9EDF84-3C0F-6CED-850E-5B1D6F2BD03D' => {
        :family => 'CamingoWeb',
        #:weight => 'normal',
      },
      'A443627D-EB8E-E917-6820-8D149D2EF81C' => {
        :family => 'CamingoWeb',
        :weight => 200,
      },
      '21065B86-3136-64EB-905A-327D8C8DE895' => {
        :family => 'CamingoWeb',
        :style  => :italic,
        :weight => 500,
      },
      'F224F5AC-F7FD-B23E-27F2-CBCBD9930478' => {
        :family => 'CamingoWeb',
        :weight => 300,
      },
      'DB94427D-4D01-C0D9-6FCE-2E4ADA71BC8D' => {
        :family => 'CamingoWeb',
        :style  => :italic,
        :weight => 900,
        :enabled => false,
      },
      'B68F1E61-ABEE-3C89-621B-641468656DBB' => {
        :family => 'CamingoWeb',
        :weight => 500,
      },
      '65407FCC-B52C-DF4A-EC8E-0EC19DDFDD44' => {
        :family => 'CamingoWeb',
        :weight => 700,
      },
      '337196A3-1754-5AE5-72E9-B73F92CE156A' => {
        :family => 'CamingoWeb',
        :style  => :italic
        #:weight => 'normal',
      },
      'C4C06B6C-3C52-04FA-05D8-0837158487C0' => {
        :family => 'SourceCodePro',
        #:style  => :italic
        #:weight => 'normal',
      },
      '3C6EEDC2-A56B-77E4-2B41-C34ACBAA0499' => {
        :family => 'SourceCodePro',
        #:style  => :italic
        :weight => '700',
      },
    }
  }


  def self.link
    %Q{<link href="#{href}" rel="stylesheet" type="text/css" />}
  end

  def self.href
    "//fnt.webink.com/wfs/webink.css?".tap do |s|
      s << "project=#{CONFIG[:project]}&fonts="
      s << CONFIG[:fonts].select { |_, f| f.fetch(:enabled, true) }.map do |id, font|
        "#{id}:#{font(font)}"
      end.join(',')
    end
  end

  def self.font(font)
    font.to_a.map { |pair| pair.join('=') }.join(':')
  end

end

