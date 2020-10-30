$(function() {

    // 登录注册切换
    $('#link_reg').on('click', function() {
        $(".reg-box").show();
        $(".login-box").hide();
    });

    $('#link_login').on('click', function() {
        $(".login-box").show();
        $(".reg-box").hide();
    })

    //表单验证
    var form = layui.form;
    var layer = layui.layer;
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        repwd: function(value) {
            /* .reg-box [name="password"] */
            var pwd = $('.reg-box [name="password"]').val();
            if (pwd !== value) {
                return "两次密码不一致"
            }
        }
    })

    // 注册事件
    $("#reg-form").on("submit", function(e) {
        e.preventDefault();
        var data = $(this).serialize();
        $.post('/api/reguser', data, function(res) {
            if (res.status !== 0) {
                return layer.msg(res.message)
            }
            layer.msg("注册成功，请登录！")
            $('#link_login').click();
        })
    })

    //登录事件
    $("#login-form").submit(function(e) {
        e.preventDefault();
        $.ajax({
            url: '/api/login',
            method: 'POST',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg("登录失败");
                }
                layer.msg("登录成功");
                localStorage.setItem('token', res.token)
                location.href = "/index.html"
            }
        })

    })

})