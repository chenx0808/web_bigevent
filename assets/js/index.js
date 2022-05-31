// 获取用户基本信息
function getUserInfo() {
  $.ajax({
    type: "GET",
    url: "/my/userinfo",
    // headers: {
    //   Authorization: localStorage.getItem("token"),
    // },
    success: (res) => {
      if (res.status !== 0) return layer.msg(res.message);
      layer.msg(res.message);
      //   console.log(res);
      renderAvatar(res.data);
    },
  });
}

// 渲染用户信息
const renderAvatar = (user) => {
  // console.log(user);
  let uname = user.nickname || user.username;
  //   console.log(uname);
  //   渲染欢迎语
  $("#welcome").html(`欢迎${uname}`);
  // 按需渲染用户头像
  if (user.user_pic !== null) {
    // 设置图片头像
    $(".layui-nav-img").attr("src", user.user_pic).show();
    $(".text-avatar").hide();
  } else {
    //   设置文本头像
    $(".layui-nav-img").hide();
    $(".text-avatar").html(uname[0].toUpperCase());
  }
};

// 退出功能
$("#btnlogout").click(() => {
  layer.confirm(
    "确定退出登录？",
    { icon: 3, title: "" },
    function (index) {
      localStorage.removeItem("token");
      location.href = "login.html";
    }
  );
});

getUserInfo();
