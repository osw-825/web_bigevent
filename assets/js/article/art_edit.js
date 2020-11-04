$(function() {
    var form = layui.form;
    var layer = layui.layer;
    var params = new URLSearchParams(location.search)
    var artId = params.get('id')




    initCate()

    //获取分类
    function initCate() {
        $.ajax({
            method: "GET",
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('列表初始化失败')
                }
                var htmlStr = template('tpl-cate', res);
                $('[name="cate_id"]').html(htmlStr)
                form.render();
                getAtrById()
            }
        })
    }


    //获取文章详情
    function getAtrById() {

        $.ajax({
            method: 'GET',
            url: '/my/article/' + artId,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取失败');
                }
                var art = res.data
                form.val('addArt', {
                    Id: art.artId,
                    title: art.title,
                    cate_id: art.cate_id,
                    content: art.content
                })

                initEditor()

                var $image = $('#image')

                $image.attr('src', 'http://ajax.frontend.itheima.net' + art.cover_img)

                // 2. 裁剪选项
                var options = {
                    aspectRatio: 400 / 280,
                    preview: '.img-preview',
                    autoCropArea: 1
                }

                // 3. 初始化裁剪区域
                $image.cropper(options)


            }
        })
    }



    //选择封面
    $('#btnChooseImage').on('click', function() {
        $('#coverFile').click();
    })

    $('#coverFile').on('change', function(e) {
        var files = e.target.files
        if (files.length === 0) {
            return
        }

        var newImgURL = URL.createObjectURL(files[0])

        $('#image')
            .cropper('destroy')
            .attr('src', newImgURL)
            .cropper({
                aspectRatio: 400 / 280,
                preview: '.img-preview',
            })

    })


    var art_state = '已发布'
    $('#btnsave2').on('click', function() {
        art_state = '草稿'

    })



    $('#formPub').submit(function(e) {
        e.preventDefault();
        var fd = new FormData($(this)[0])
        fd.append('Id', artId)
        $('#image')
            .cropper('getCroppedCanvas', {
                width: 400,
                height: 280
            })
            .toBlob(function(blob) {
                fd.append('state', art_state)
                fd.append('cover_img', blob)
                    //  发起 ajax 数据请求
                $.ajax({
                    method: 'POST',
                    url: '/my/article/edit',
                    data: fd,
                    contentType: false,
                    processData: false,
                    success: function(res) {
                        if (res.status !== 0) {

                            return layer.msg('更新失败')
                        }
                        location.href = '/article/art_list.html'
                    }
                })
            })
    })

})