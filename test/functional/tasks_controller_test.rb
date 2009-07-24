require 'test_helper'

class TasksControllerTest < ActionController::TestCase
  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:tasks)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create tasks" do
    assert_difference('Tasks.count') do
      post :create, :tasks => { }
    end

    assert_redirected_to tasks_path(assigns(:tasks))
  end

  test "should show tasks" do
    get :show, :id => tasks(:one).to_param
    assert_response :success
  end

  test "should get edit" do
    get :edit, :id => tasks(:one).to_param
    assert_response :success
  end

  test "should update tasks" do
    put :update, :id => tasks(:one).to_param, :tasks => { }
    assert_redirected_to tasks_path(assigns(:tasks))
  end

  test "should destroy tasks" do
    assert_difference('Tasks.count', -1) do
      delete :destroy, :id => tasks(:one).to_param
    end

    assert_redirected_to tasks_path
  end
end
