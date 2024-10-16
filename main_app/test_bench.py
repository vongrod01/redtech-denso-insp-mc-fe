from django.shortcuts import render
from RTDensoInspMachineMachine_Frontend.settings import system_config_get
import json
from django.http import JsonResponse
SystemConfig = system_config_get()
host = SystemConfig['host'][0]
def test_bench_mc(request):
    # return render(request,'TestBench/test_bench.html')
    user_session = request.session.get('User', None)
    # print(user_session)
    try:

        if user_session != None and user_session['RxNo'] != '':
            data = user_session
            data['host'] = host
            return render(request,'TestBench/test_bench.html', data)
        else:
            return render(request, 'go_to_login.html')
    except Exception as e:
        print(e)
        return render(request, 'go_to_login.html')
