class Task < ActiveRecord::Base
  belongs_to :user
  belongs_to :project
  belongs_to :area
  belongs_to :status
  acts_as_taggable

  default_scope :conditions => { :deleted_at => nil }
  named_scope :inbox, :conditions => {:status_id => 1}, :order => "created_at DESC"
  named_scope :today, :conditions => {:status_id => 2}, :order => "created_at DESC"
  
  named_scope :next, :conditions => {:status_id => [3,2]}, 
                     :include => [:project, :area], 
                     :order => "project_id, area_id, created_at DESC"
  
  named_scope :scheduled, :conditions => {:status_id => 4}, :order => "created_at DESC"
  named_scope :someday, :conditions => {:status_id => 5}, :order => "created_at DESC"
  named_scope :done, :conditions => {:status_id => 6}, :order => "done_at DESC"
  
  
  def in_inbox?
    self.status_id == Status.find_by_title('inbox').id
  end
  
  def in_today?
    self.status_id == Status.find_by_title('today').id
  end
  
  def in_next?
    self.status_id == Status.find_by_title('next').id
  end
  
  def in_scheduled?
    self.status_id == Status.find_by_title('scheduled').id
  end
  alias :scheduled? :in_scheduled?

  def in_someday?
    self.status_id == Status.find_by_title('someday').id
  end

  def in_trash?
    self.status_id == Status.find_by_title('trash').id
  end

  def done?
    self.done_at
  end
  
  def in_logbook?
    self.status_id == Status.find_by_title('done').id
  end
  
  def overdue?
    self.due_at && ((self.due_at.to_time - Time.now) < 86400)
  end
  
  def due_date
    self.due_at.strftime("%b ") + self.due_at.strftime("%d").to_i.to_s + self.due_at.strftime(", %Y") if self.due_at
  end
  
  def due_date=(date)
    begin
      if date != ""
        self.due_at = DateTime.parse(date + " , 12:00:00")     # FIX-ME
      else 
        self.due_at = nil
      end
    rescue
      self.errors.add(:due_date, "Invalid date format")
    end
  end
  
  def show_days_before_due
    (self.due_at && self.show_date_before_due) ? distance_in_days(self.due_at, self.show_date_before_due) : 0
  end

  def show_days_before_due=(num)
    if ((self.due_date) && (self.due_date != "")  && (num.to_i != 0))
      due = DateTime.parse(self.due_date + " , 12:00:00")                  # FIX-ME
      self.show_date_before_due = due - num.to_i.days 
    else 
      self.show_date_before_due = nil
    end
  end
  
private #------------------------------------------

  def distance_in_days(from_time, to_time )
    from_time = from_time.to_time if from_time.respond_to?(:to_time)
    to_time   = to_time.to_time if to_time.respond_to?(:to_time)
    distance_in_days = (((to_time - from_time).abs)/86400).round
    return distance_in_days
  end


end
