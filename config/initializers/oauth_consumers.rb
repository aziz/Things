# edit this file to contain credentials for the OAuth services you support.
# each entry needs a corresponding token model.
#
# eg. :twitter => TwitterToken, :hour_feed => HourFeedToken etc.
#
# OAUTH_CREDENTIALS={
#   :twitter=>{
#     :key=>"",
#     :secret=>""
#   },
#   :agree2=>{
#     :key=>"",
#     :secret=>""
#   },
#   :fireeagle=>{
#     :key=>"",
#     :secret=>""
#   },
#   :hour_feed=>{
#     :key=>"",
#     :secret=>"",
#     :options=>{ # OAuth::Consumer options
#       :site=>"http://hourfeed.com" # Remember to add a site for a generic OAuth site
#     }
#   },
#   :nu_bux=>{
#     :key=>"",
#     :secret=>"",
#     :super_class=>"OpenTransactToken",  # if a OAuth service follows a particular standard 
#                                         # with a token implementation you can set the superclass
#                                         # to use
#     :options=>{ # OAuth::Consumer options
#       :site=>"http://nubux.heroku.com" 
#     }
#   }
# }
# 
OAUTH_CREDENTIALS={
   :twitter=>{
     :key=>"bhne3B2JFJW7wdpBLeytEw",
     :secret=>"w0FEAnQ5oc5EoqJbMePdEHmXQzx508nesyRSvIqnVg"
   }
} unless defined? OAUTH_CREDENTIALS

load 'oauth/models/consumers/service_loader.rb'