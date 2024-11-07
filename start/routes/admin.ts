import Route from '@ioc:Adonis/Core/Route';

/****************************
 * Route Prefixed with api/v1
 *****************************/
Route.group(() => {
  /****************************
   * Authenticated Routes
   *****************************/
  Route.group(() => {
    /*Users*/
    Route.resource('users', 'Api/UserController')

    /*My profile*/
    Route.get('me', 'Api/UserController.me').as('admin-profile')
    /*API-Page*/
    Route.resource('pages', 'Api/PageController')
  }).middleware(['auth', 'admin'])
}).prefix('/admin/v1').as('admin')
