class CreateStatuses < ActiveRecord::Migration
  def self.up
    create_table :statuses do |t|
      t.string :title, :null => false
      t.timestamps
    end
    Status.create(:title => 'inbox')
    Status.create(:title => 'today')
    Status.create(:title => 'next')
    Status.create(:title => 'scheduled')
    Status.create(:title => 'someday')
    Status.create(:title => 'done')
    Status.create(:title => 'trash')
  end

  def self.down
    drop_table :statuses
  end
end
