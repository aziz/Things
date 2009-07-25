# This file is auto-generated from the current state of the database. Instead of editing this file, 
# please use the migrations feature of Active Record to incrementally modify your database, and
# then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your database schema. If you need
# to create the application database on another system, you should be using db:schema:load, not running
# all the migrations from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20090725003924) do

  create_table "areas", :force => true do |t|
    t.string   "title",      :null => false
    t.integer  "user_id",    :null => false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "projects", :force => true do |t|
    t.string   "title",                                  :null => false
    t.text     "notes"
    t.integer  "user_id",                                :null => false
    t.datetime "deleted_at"
    t.datetime "due_at"
    t.datetime "done_at"
    t.boolean  "active",               :default => true
    t.datetime "created_at"
    t.datetime "updated_at"
    t.datetime "show_date_before_due"
    t.integer  "status_id"
    t.integer  "area_id"
  end

  create_table "sessions", :force => true do |t|
    t.string   "session_id", :null => false
    t.text     "data"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "sessions", ["session_id"], :name => "index_sessions_on_session_id"
  add_index "sessions", ["updated_at"], :name => "index_sessions_on_updated_at"

  create_table "statuses", :force => true do |t|
    t.string   "title",      :null => false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "taggings", :force => true do |t|
    t.integer  "tag_id"
    t.integer  "taggable_id"
    t.string   "taggable_type"
    t.datetime "created_at"
  end

  add_index "taggings", ["tag_id"], :name => "index_taggings_on_tag_id"
  add_index "taggings", ["taggable_id", "taggable_type"], :name => "index_taggings_on_taggable_id_and_taggable_type"

  create_table "tags", :force => true do |t|
    t.string "name"
  end

  create_table "tasks", :force => true do |t|
    t.string   "title",                                   :null => false
    t.text     "notes"
    t.integer  "project_id"
    t.integer  "user_id",                                 :null => false
    t.integer  "co_user_id"
    t.integer  "area_id"
    t.integer  "status_id",            :default => 1
    t.datetime "deleted_at"
    t.datetime "due_at"
    t.datetime "done_at"
    t.boolean  "scheduled",            :default => false
    t.datetime "created_at"
    t.datetime "updated_at"
    t.datetime "show_date_before_due"
  end

  create_table "users", :force => true do |t|
    t.string   "login",                        :limit => 40
    t.string   "name",                         :limit => 100, :default => ""
    t.string   "email",                        :limit => 100
    t.string   "crypted_password",             :limit => 40
    t.string   "salt",                         :limit => 40
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "remember_token",               :limit => 40
    t.datetime "remember_token_expires_at"
  end

  add_index "users", ["login"], :name => "index_users_on_login", :unique => true

end
