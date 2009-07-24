# Be sure to restart your server when you modify this file.

# Your secret key for verifying cookie session data integrity.
# If you change this key, all old sessions will become invalid!
# Make sure the secret is at least 30 characters and all random, 
# no regular words or you'll be exposed to dictionary attacks.
ActionController::Base.session = {
  :key         => '_Things_session',
  :secret      => '942a08c8817f66250604ee69a9295362f982812f0bec92b6d2783b3be18b926ab870678e17703d76eed7a7f072552cd31d2352872e049e995c1c58e0f2d5479b'
}
# Use the database for sessions instead of the cookie-based default,
# which shouldn't be used to store highly confidential information
# (create the session table with "rake db:sessions:create")
ActionController::Base.session_store = :active_record_store

