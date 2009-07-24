class AddingShowDueBeforeDate < ActiveRecord::Migration
  def self.up
    add_column :tasks, :show_date_before_due, :datetime
  end

  def self.down
    remove_column :tasks, :show_date_before_due
  end
end
