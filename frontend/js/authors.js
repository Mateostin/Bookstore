$(function () {
    var $authorAddForm = $('#authorAdd')
    // GET ALL AUTHORS AND DISPLAY IN TABLE
    $.get('http://localhost/Bookstore/rest/rest.php/author')
        .done(function (data) {
            if (data.success && data.success.length > 0) {
                data.success.forEach(function (elm) {
                    createNewAuthor(elm)
                })
            }
        })

    // ADD NEW AUTHOR TO DATABASE FROM FORM
    $authorAddForm.on('submit', function (event) {
        event.preventDefault()
        var nameToCheck = $('#authorAdd').children().eq(1).find('#name').val()
        var surnameToCheck = $('#authorAdd').children().eq(2).find('#surname').val()

        if (!nameToCheck || !surnameToCheck) {
            showModal("Imie i Nazwisko autora jest wymagane!");
        } else {
            $.post('http://localhost/Bookstore/rest/rest.php/author', $(this).serialize())
                .done(function (data) {
                    if (data.success && data.success.length > 0) {
                        createNewAuthor(data.success[0])
                    }
                })
        }
    })

    // ADD REMOVE BUTTON FUNCTION
    $('#authorsList').on('click', '.btn-author-remove', function () {
        var $me = this
        $.ajax({
            url: "http://localhost/Bookstore/rest/rest.php/author/" + $(this).data('id'),
            type: "DELETE"
        }).done(function (data) {
            if (data.success == 'deleted') {
                showModal("Pomyślnie usunięto autora!");
                $($me).parent().parent().parent().remove()
            }
        })
    })

    // DISCOVERING BOOK FROM AUTHOR ON CLICK
    $('#authorsList').on('click', '.btn-author-books', function () {
        $('.authorBooksList li').remove()
        $('.authorBooksList').css('display', 'none')
        var authorID = $(this).data('id')
        let $ul = $('.authorBooksList').css('display', 'none')
        let $liBooks = $('<li>', {class: 'author-books'})

        $.get('http://localhost/Bookstore/rest/rest.php/author/' + authorID)
            .done(function (data) {
                if (data.success && data.success.length > 0) {
                    data.success.forEach(function (elm) {
                        elm.books.forEach(function (book) {
                            $liBooks.text(book.title)
                            $ul.append($liBooks)

                        })
                    })
                }
            })
        $(this).parent().parent().find('.authorBooksList').toggle()
    })

    // GET SELECTED OPTION FOR EDITING BOOK
    $('#authorEditSelect').on('change', function () {
        var authorID = $(this).val()
        if (!authorID) {
            $('#authorEdit').css('display', 'none')
        } else {
            $.get('http://localhost/Bookstore/rest/rest.php/author/' + authorID)
                .done(function (data) {
                    if (data.success && data.success.length > 0) {
                        data.success.forEach(function (elm) {
                            $('#authorEdit').children().eq(0).attr('value', elm.id)
                            $('#authorEdit').children().eq(2).find('#name').val(elm.name)
                            $('#authorEdit').children().eq(3).find('#surname').val(elm.surname)
                        })
                    }
                })

            $('#authorEdit').css('display', 'block')

            // SAVE CHANGES
            $('#authorEdit').find('button').on('click', function (event) {
                event.preventDefault()

                var idToChange = $('#authorEdit').children().eq(0).val()
                var authorToEdit = $('#authorEdit').serialize()

                $.ajax({
                    url: "http://localhost/Bookstore/rest/rest.php/author/" + idToChange,
                    type: "PATCH",
                    data: authorToEdit

                }).done(function (data) {
                    if (data.success && data.success.length > 0) {
                        $('#authorEdit').css('display', 'none')
                        data.success.forEach(function (elm) {
                            $('#authorEditSelect').find('option[value="' + elm.id + '"]').attr("selected", "selected").text(elm.name + " " + elm.surname)
                            $('div').find('button[data-id="' + elm.id + '"]').eq(0).parent().find('span').text(elm.name + " " + elm.surname)
                        })
                        showModal("Edycja przebiegła pomyślnie!");
                    }
                })
            })
        }


    })

})


let createNewAuthor = (author) => {

    // ADD AUTHORS IN TABLE

    let $authorsList = $('#authorsList')
    let $li = $('<li>', {class: 'list-group-item'})
    let $panel = $('<div>', {class: 'panel panel-default'})
    let $heading = $('<div>', {class: 'panel-heading'})
    let $authorName = $('<span>', {class: 'authorTitle'})
    let $buttonRemove = $('<button class="btn btn-danger pull-right btn-xs btn-author-remove"><i class="fa fa-trash"></i></button>')
    let $buttonShowBooks = $('<button class="btn btn-primary pull-right btn-xs btn-author-books"><i class="fa fa-book"></i></button>')
    let $authorBooks = $('<ul>', {class: 'authorBooksList'})

    $authorName.text(author.name + " " + author.surname)
    $buttonRemove.attr('data-id', author.id)
    $buttonShowBooks.attr('data-id', author.id)

    $heading.append($authorName).append($buttonRemove).append($buttonShowBooks)
    $panel.append($heading).append($authorBooks)
    $li.append($panel)
    $authorsList.append($li)

    // ADD AUTHORS IN SELECT FORM FOR EDIT
    let $option = $('<option>', {value: author.id}).text(author.name + " " + author.surname)

    $('#authorEditSelect').append($option)

}