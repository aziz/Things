class CreateTasks < ActiveRecord::Migration
  def self.up
    create_table :tasks do |t|
      t.string :title, :null => false
      t.text :notes
      t.integer :project_id
      t.integer :user_id, :null => false
      t.integer :co_user_id
      t.integer :area_id
      t.integer :status_id, :default => 1
      t.datetime :deleted_at
      t.datetime :due_at
      t.datetime :done_at
      t.boolean :scheduled, :default => false
      t.timestamps
    end
  end

  def self.down
    drop_table :tasks
  end
end
