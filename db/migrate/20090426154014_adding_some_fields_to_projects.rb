class AddingSomeFieldsToProjects < ActiveRecord::Migration
  def self.up
    add_column :projects, :show_date_before_due, :datetime
    add_column :projects, :status_id, :integer
    add_column :projects, :area_id, :integer
  end

  def self.down
    remove_column :projects, :show_date_before_due
    remove_column :projects, :status_id
    remove_column :projects, :area_id
  end
end
