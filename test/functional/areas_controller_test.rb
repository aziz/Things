require 'test_helper'

class AreasControllerTest < ActionController::TestCase
  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:areas)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create areas" do
    assert_difference('Areas.count') do
      post :create, :areas => { }
    end

    assert_redirected_to areas_path(assigns(:areas))
  end

  test "should show areas" do
    get :show, :id => areas(:one).to_param
    assert_response :success
  end

  test "should get edit" do
    get :edit, :id => areas(:one).to_param
    assert_response :success
  end

  test "should update areas" do
    put :update, :id => areas(:one).to_param, :areas => { }
    assert_redirected_to areas_path(assigns(:areas))
  end

  test "should destroy areas" do
    assert_difference('Areas.count', -1) do
      delete :destroy, :id => areas(:one).to_param
    end

    assert_redirected_to areas_path
  end
end
