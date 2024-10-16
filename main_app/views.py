from django.shortcuts import render
from RTDensoInspMachineMachine_Frontend.settings import system_config_get
import json
from django.http import JsonResponse
SystemConfig = system_config_get()
host = SystemConfig['host'][0]
def login(request):
    return render(request, 'login.html', {'host': host})

def set_session_user(request):
    if request.method == 'POST':
        data_req = json.loads(request.body)
        request.session['User'] = data_req
    return JsonResponse({'set_session': True})
def get_session_user(request):
    if request.method == 'GET':
        user_session = request.session.get('User', None)
        return JsonResponse(user_session)
    else:
        return JsonResponse({'user': False})