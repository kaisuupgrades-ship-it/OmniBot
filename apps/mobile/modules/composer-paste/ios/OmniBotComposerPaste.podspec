Pod::Spec.new do |s|
  s.name           = 'OmniBotComposerPaste'
  s.version        = '1.0.0'
  s.summary        = 'File paste for the OmniBot chat composer'
  s.description    = 'Gives photos, videos and other files pasted in the chat composer to JavaScript as files.'
  s.license        = 'PolyForm-Noncommercial-1.0.0'
  s.author         = 'OmniBot'
  s.homepage       = 'https://omnibot.example.com'
  s.platforms      = { :ios => '16.4' }
  s.swift_version  = '5.9'
  s.source         = { git: '' }
  s.static_framework = true

  s.dependency 'ExpoModulesCore'

  s.source_files = "**/*.swift"
  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES',
    'SWIFT_COMPILATION_MODE' => 'wholemodule'
  }
end
