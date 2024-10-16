from django.urls import path
from . import views, test_bench

urlpatterns = [
   path('DensoInspMachine/login', views.login, name='login'),
   path('DensoInspMachine/set_session_user', views.set_session_user, name='set_session_user'),
   path('DensoInspMachine/get_session_user', views.get_session_user, name='get_session_user'),
   path('DensoInspMachine/test_bench_mc', test_bench.test_bench_mc, name='test_bench_mc'),
]