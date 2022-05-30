$(function () {
  //登录注册切换功能
  $("#link_reg").click(() => {
    $(".login-box").hide();
    $(".reg-box").show();
  });

  $("#link_login").click(() => {
    $(".login-box").show();
    $(".reg-box").hide();
  });

  //   引入form模块
  const form = layui.form;
  const layer = layui.layer;

  //自定义校验规则
  form.verify({
    // 密码校验规则
    pwd: [/^[\S]{6,12}$/, "密码必须6到12位，且不能出现空格"],
    // 确认密码校验规则
    repwd: (value) => {
      // 1:获取当前输入的值
      // 2：获取密码框的值
      // 3:两者进行判断
      // 4:如果不一致，提示消息
      const pwd = $("#form_reg [name=password]").val();
      if (pwd !== value) return "两次密码不正确";
    },
  });

  //   设置baseUrl
//   const baseUrl = "http://www.liulongbin.top:3007";

  // 注册功能
  $("#form_reg").on("submit", (e) => {
    // 阻止默认提交事件
    e.preventDefault();
    $.ajax({
      type: "POST",
      url:  "/api/reguser",
      data: {
        username: $("#form_reg [name=username]").val(),
        password: $("#form_reg [name=password]").val(),
      },
      success: (res) => {
        if (res.status !== 0) return layer.msg(res.message);
        layer.msg(res.message);
        // 注册成功后跳转到登录界面
        $("#link_login").click();
      },
    });
  });

  //登录功能
  $("#form_login").on("submit", function (e) {
    e.preventDefault();
    $.ajax({
      type: "POST",
      url:  "/api/login",
      data: $(this).serialize(),
      success: (res) => {
        if (res.status !== 0) return layer.msg(res.message);
        layer.msg(res.message);
        // console.log(res);
        // 登录成功后需要把token ；令牌存放本地
        localStorage.setItem("token", res.token);
        // 跳转到本地
        location.href = "/index.html";
      },
    });
  });
});
