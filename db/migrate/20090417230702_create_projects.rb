class CreateProjects < ActiveRecord::Migration
  def self.up
    create_table :projects do |t|
      t.string :title, :null => false
      t.text :notes
      t.integer :user_id, :null => false
      t.datetime :deleted_at
      t.datetime :due_at
      t.datetime :done_at
      t.boolean :active, :default => true
      t.timestamps
    end
  end

  def self.down
    drop_table :projects
  end
end
