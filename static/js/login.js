function login() {
    let userName = document.getElementById('edtUserName').value
    let password = document.getElementById('edtPassword').value
    let dataReq = {
        UserName: userName,
        Password: password
    }
    reqAndRes(`${host}/DensoInspMachine_API/UserLogin/`, 'GET', dataReq, async (dataRes) => {
        console.log('user :',dataRes)
        if (dataRes.login_conplete) {

            await fetch(url_set_session_user, {
                method: 'POST',
                headers: csrf_token,
                body: JSON.stringify(dataRes.user),
            })
                .then((response) => {
                    if (response.ok) {
                        return response.json();
                    }
                    else {
                        return false;
                    }
                })
                .then(async (response) => {
                    console.log(response)
                    if (response.set_session) {
                        let host = window.location.protocol + '//' + window.location.host;
                        window.open(host + url_test_bench_mc, '_self');
                    }
                })
                .catch((err) => {

                    Swal.fire(err.statusText, url, 'error');

                })


        }
        else {
            Swal.fire({
                title: "There was a problem logging in.",
                text: dataRes.login_detail,
                icon: "warning"
            });
        }
    })
}