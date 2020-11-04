$(function() {


    var q = {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: ''
    }

    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;

    initTable()
    initCate()

    function renderPage(total) {
        laypage.render({
            elem: 'pageBox',
            count: total,
            limit: q.pagesize,
            curr: q.pagenum,
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            jump: function(obj, first) {
                q.pagenum = obj.curr;
                q.pagesize = obj.limit;
                if (!first) {
                    initTable();
                }
            }

        })
    }

    //文章列表  
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取列表失败')
                }
                //console.log(res);
                var htmlStr = template('tpl-tab', res)
                $('tbody').html(htmlStr)
                renderPage(res.total)
            }
        })
    }

    //文章分类
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取分类失败')
                }
                var htmlStr = template('tpl-cate', res)
                $('[name="cate_id"]').html(htmlStr)
                form.render();
            }
        })
    }

    //筛选
    $('#form-search').submit(function(e) {
        e.preventDefault();
        var cate_id = $('[name="cate_id"]').val();
        var state = $('[name="state"]').val();
        q.cate_id = cate_id;
        q.state = state;
        initTable();
    })

    //时间
    template.defaults.imports.dataFormat = function(data) {
        const dt = new Date(data)
        var y = dt.getFullYear();
        var m = padZero(dt.getMonth() + 1);
        var d = padZero(dt.getDate());

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    function padZero(n) {
        return n > 9 ? n : '0' + n;
    }



    //删除
    $('tbody').on('click', '.btn-delete', function() {
        var dellen = $('.btn-delete').length;
        var id = $(this).attr('data-id');
        layer.confirm('确定删除数据?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除数据失败')
                    }
                    layer.msg('删除数据成功')
                    if (dellen === 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                    }
                    initTable();
                }
            })

            layer.close(index);
        });
    })


    //编辑

    $('body').on('click', '.btn-edit', function() {

        location.href = '/article/art_edit.html?id=' + $(this).attr('data-id')
            // console.log($(this).attr('data-id'));
    })

})