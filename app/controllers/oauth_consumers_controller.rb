require 'oauth/controllers/consumer_controller'
class OauthConsumersController < ApplicationController
  include Oauth::Controllers::ConsumerController
  skip_before_filter :login_required
  
  protected
  
  # Change this to decide where you want to redirect user to after callback is finished.
  # params[:id] holds the service name so you could use this to redirect to various parts
  # of your application depending on what service you're connecting to.
  def go_back
    redirect_to root_url
  end
  
  
  
  
  
  # ===========
  
  
#def callback
#  @request_token_secret=session[params[:oauth_token]]
#  if @request_token_secret
#    @token=@consumer.create_from_request_token(current_user,params[:oauth_token],@request_token_secret,params[:oauth_verifier])
#    if @token
#      flash[:notice] = "#{params[:id].humanize} was successfully connected to your account"
#      go_back
#    else
#      flash[:error] = "An error happened, please try connecting again"
#      redirect_to oauth_consumer_url(params[:id])
#    end
#  end
#
#end
#  
#def callback
#  @request_token = OAuth::RequestToken.new( UsersController.consumer, session[:request_token], session[:request_token_secret])
#  # Exchange the request token for an access token.
#  @access_token = @request_token.get_access_token(:oauth_verifier => params[:oauth_verifier])
#  @response = UsersController.consumer.request(:get, '/account/verify_credentials.json',
#  @access_token, { :scheme => :query_string })
#  case @response
#    when Net::HTTPSuccess
#      user_info = JSON.parse(@response.body)
#      unless user_info['screen_name']
#        flash[:notice] = "Authentication failed"
#        redirect_to :action => :index
#        return
#      end
#      # We have an authorized user, save the information to the database.
#      @user = User.new({ :screen_name => user_info['screen_name'], :token => @access_token.token, :secret => @access_token.secret })
#      @user.save!
#      # Redirect to the show page
#      redirect_to(@user)
#    else
#      RAILS_DEFAULT_LOGGER.error "Failed to get user info via OAuth"
#      # The user might have rejected this application. Or there was some other error during the request.
#      flash[:notice] = "Authentication failed"
#      redirect_to :action => :index
#      return
#    end
#  end
#
#end

  
  
  # ===========
  
end
