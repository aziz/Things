require 'test_helper'

class ProjectsControllerTest < ActionController::TestCase
  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:projects)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create projects" do
    assert_difference('Projects.count') do
      post :create, :projects => { }
    end

    assert_redirected_to projects_path(assigns(:projects))
  end

  test "should show projects" do
    get :show, :id => projects(:one).to_param
    assert_response :success
  end

  test "should get edit" do
    get :edit, :id => projects(:one).to_param
    assert_response :success
  end

  test "should update projects" do
    put :update, :id => projects(:one).to_param, :projects => { }
    assert_redirected_to projects_path(assigns(:projects))
  end

  test "should destroy projects" do
    assert_difference('Projects.count', -1) do
      delete :destroy, :id => projects(:one).to_param
    end

    assert_redirected_to projects_path
  end
end
