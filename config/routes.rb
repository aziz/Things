ActionController::Routing::Routes.draw do |map|
  map.resources :oauth_consumers,:member=>{:callback=>:get}


  map.logout '/logout', :controller => 'sessions', :action => 'destroy'
  map.login '/login', :controller => 'sessions', :action => 'new'
  map.register '/register', :controller => 'users', :action => 'create'
  map.signup '/signup', :controller => 'users', :action => 'new'
  
  map.inbox '/inbox', :controller => 'things', :action => 'inbox'
  map.today '/today', :controller => 'things', :action => 'today'
  map.next '/next', :controller => 'things', :action => 'next'
  map.scheduled '/scheduled', :controller => 'things', :action => 'scheduled'
  map.someday '/someday', :controller => 'things', :action => 'someday'
  map.logbook '/logbook', :controller => 'things', :action => 'logbook'
  map.trash '/trash', :controller => 'things', :action => 'trash'
  
  
  map.trash '/app', :controller => 'things', :action => 'app'
  
  map.resources :users
  map.resources :tasks , :member => { :done => :put, :undone => :put, :moveto => :post  }, 
                         :collection => { :log => :post, :destroy_all => :delete }
  map.resources :projects, :member => { :done => :put, :undone => :put}, 
                           :collection => { :destroy_all => :delete }
  map.resources :areas
  
  map.resource :session
  
  map.root :controller => 'things', :action => 'inbox'

  # The priority is based upon order of creation: first created -> highest priority.

  # Sample of regular route:
  #   map.connect 'products/:id', :controller => 'catalog', :action => 'view'
  # Keep in mind you can assign values other than :controller and :action

  # Sample of named route:
  #   map.purchase 'products/:id/purchase', :controller => 'catalog', :action => 'purchase'
  # This route can be invoked with purchase_url(:id => product.id)

  # Sample resource route (maps HTTP verbs to controller actions automatically):
  #   map.resources :products

  # Sample resource route with options:
  #   map.resources :products, :member => { :short => :get, :toggle => :post }, :collection => { :sold => :get }

  # Sample resource route with sub-resources:
  #   map.resources :products, :has_many => [ :comments, :sales ], :has_one => :seller
  
  # Sample resource route with more complex sub-resources
  #   map.resources :products do |products|
  #     products.resources :comments
  #     products.resources :sales, :collection => { :recent => :get }
  #   end

  # Sample resource route within a namespace:
  #   map.namespace :admin do |admin|
  #     # Directs /admin/products/* to Admin::ProductsController (app/controllers/admin/products_controller.rb)
  #     admin.resources :products
  #   end

  # You can have the root of your site routed with map.root -- just remember to delete public/index.html.
  # map.root :controller => "welcome"

  # See how all your routes lay out with "rake routes"

  # Install the default routes as the lowest priority.
  # Note: These default routes make all actions in every controller accessible via GET requests. You should
  # consider removing the them or commenting them out if you're using named routes and resources.
  map.connect ':controller/:action/:id'
  map.connect ':controller/:action/:id.:format'
end
