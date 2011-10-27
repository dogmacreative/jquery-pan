# -*- encoding: utf-8 -*-
$:.push File.expand_path("../lib", __FILE__)
require "jquery-pan/version"

Gem::Specification.new do |s|
  s.name        = "jquery-pan"
  s.version     = JqueryPan::VERSION
  s.authors     = ["Richard Kimber"]
  s.email       = ["richard@dogma.co.uk"]
  s.homepage    = ""
  s.summary     = ""
  s.description = "Add panning to HTML Elements"

  s.rubyforge_project = "jquery-pan"

  s.files         = `git ls-files`.split("\n")
  s.test_files    = `git ls-files -- {test,spec,features}/*`.split("\n")
  s.executables   = `git ls-files -- bin/*`.split("\n").map{ |f| File.basename(f) }
  s.require_paths = ["lib"]

  # specify any dependencies here; for example:
  # s.add_development_dependency "rspec"
  # s.add_runtime_dependency "rest-client"
end
