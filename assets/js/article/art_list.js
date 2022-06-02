$(function () {
  const form = layui.form;
  const laypage = layui.laypage;
  // 定义查询参数对象，存放发送请求的数据
  const q = {
    pagenum: 1, //页码值，默认第一个
    pagesize: 2, //每页显示的条数
    cate_id: "", //查询分类文章的id
    state: "", //查询文章的状态
  };

  // 获取表格数据
  const initTable = () => {
    $.ajax({
      type: "GET",
      url: "/my/article/list",
      data: q,
      success: (res) => {
        //   console.log(res);
        if (res.status !== 0) return layer.msg(res.message);
        const htmlStr = template("tpl-table", res);
        $("tbody").html(htmlStr);
        renderPage(res.total);
      },
    });
  };

  const initCate = () => {
    $.ajax({
      type: "GET",
      url: "/my/article/cates",
      success: (res) => {
        if (res.status !== 0) return layer.msg(res.message);
        const htmlStr = template("tpl-cate", res);
        $("[name=cate_id]").html(htmlStr);
        form.render();
      },
    });
  };

  // 筛选数据
  $("#form-search").on("submit", function (e) {
    e.preventDefault();
    const cate_id = $("[name=cate_id]").val();
    const state = $("[name=state]").val();
    q.cate_id = cate_id;
    q.state = state;
    //重新调用获取文章列表函数
    initTable();
  });

  // 渲染分页
  function renderPage(total) {
    // 调用 laypage.render() 方法来渲染分页的结构
    laypage.render({
      elem: "pageBox", // 分页容器的 Id
      count: total, // 总数据条数
      limit: q.pagesize, // 每页显示几条数据
      curr: q.pagenum, // 设置默认被选中的分页
      layout: ["count", "limit", "prev", "page", "next", "skip"],
      limits: [2, 3, 5, 10], // 每页展示多少条
      //jump触发条件
      // 1：渲染的时候就会先加载一次 此时的first参数为true
      //2：切换页码的时候会触发，此时first参数为undefined
      jump: (obj, first) => {
        //   console.log(first);
        q.pagenum = obj.curr;
        q.pagesize = obj.limit;
        //渲染的时候不用调用 只有切换的时候才调用
        if (!first) {
          initTable();
        }
        q.pagenum;
      },
    });
  }

  //删除文章
  $("tbody").on("click", ".btn-delete", function () {
    //获取页面上所有删除按钮的个数
    const len = $(".btn-delete").length;
    const id = $(this).attr("data-id");
    layer.confirm("确认删除?", { icon: 3, title: "提示" }, function (index) {
      $.ajax({
        type: "GET",
        url: "/my/article/delete/" + id,
        success: (res) => {
          if (res.status !== 0) return layer.msg(res.message);
          layer.msg(res.message);
          //再从新获取文章列表之前改好q里面的参数
          if (len === 1) {
            q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
          }
          initTable();
          layer.close(index);
        },
      });
    });
  });

  initTable();
  initCate();

  // 定义美化时间的过滤器
  template.defaults.imports.dataFormat = function (date) {
    const dt = new Date(date);

    var y = dt.getFullYear();
    var m = padZero(dt.getMonth() + 1);
    var d = padZero(dt.getDate());

    var hh = padZero(dt.getHours());
    var mm = padZero(dt.getMinutes());
    var ss = padZero(dt.getSeconds());

    return y + "-" + m + "-" + d + " " + hh + ":" + mm + ":" + ss;
  };

  // 定义补零的函数
  function padZero(n) {
    return n > 9 ? n : "0" + n;
  }
});
