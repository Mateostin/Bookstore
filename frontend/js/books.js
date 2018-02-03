$(function () {
    var $bookAddForm = $('#bookAdd')
    // GET ALL BOOKS DISPLAY IN TABLE
    $.get('http://localhost/Bookstore/rest/rest.php/book')
        .done(function (data) {
            if (data.success && data.success.length > 0) {
                data.success.forEach(function (elm) {
                    createNewBook(elm)
                })
            }
        })

    // ADD NEW BOOK TO DATABASE FROM FORM
    $bookAddForm.on('submit', function (event) {
        event.preventDefault()
        var titleToCheck = $('#bookAdd').children().eq(1).find('#title').val()

        if (!titleToCheck) {
            showModal("Pole tytułu ksiązki nie moze być puste!");
        } else {
            $.post('http://localhost/Bookstore/rest/rest.php/book', $(this).serialize())
                .done(function (data) {
                    if (data.success && data.success.length > 0) {
                        createNewBook(data.success[0])
                    }
                })
        }
    })

    // DISCOVERING BOOK DESCRIPTION ON CLICK
    $('#booksList').on('click', '.btn-book-show-description', function () {
        $(this).parent().parent().find('.book-description').toggle()
    })

    // ADD REMOVE BUTTON FUNCTION
    $('#booksList').on('click', '.btn-book-remove', function () {
        var $me = this
        $.ajax({
            url: "http://localhost/Bookstore/rest/rest.php/book/" + $(this).data('id'),
            type: "DELETE"
        }).done(function (data) {
            if (data.success == 'deleted') {
                showModal("Pomyśłnie usunięto książkę!");
                $($me).parent().parent().parent().remove()
            }
        })
    })

    // GET SELECTED OPTION FOR EDITING BOOK
    $('#bookEditSelect').on('change', function () {
        var bookID = $(this).val()

        if (!bookID) {
            $('#bookEdit').css('display', 'none')
        } else {
            $.get('http://localhost/Bookstore/rest/rest.php/book/' + bookID)
                .done(function (data) {
                    if (data.success && data.success.length > 0) {
                        data.success.forEach(function (elm) {
                            $('#bookEdit').children().eq(0).attr('value', elm.id)
                            $('#bookEdit').children().eq(2).find('#title').val(elm.title)
                            $('#bookEdit').children().eq(3).find('#description').val(elm.description)
                        })
                    }
                })

            $('#bookEdit').css('display', 'block')

            // SAVE CHANGES
            $('#bookEdit').find('button').on('click', function (event) {
                event.preventDefault()

                var idToChange = $('#bookEdit').children().eq(0).val()
                var bookToEdit = $('#bookEdit').serialize()

                $.ajax({
                    url: "http://localhost/Bookstore/rest/rest.php/book/" + idToChange,
                    type: "PATCH",
                    data: bookToEdit

                }).done(function (data) {
                    if (data.success && data.success.length > 0) {
                        $('#bookEdit').css('display', 'none')
                        data.success.forEach(function (elm) {
                            $('#bookEditSelect').find('option[value="' + elm.id + '"]').attr("selected", "selected").text(elm.title)
                            $('div').find('button[data-id="' + elm.id + '"]').eq(0).parent().find('span').text(elm.title)
                        })
                        showModal("Edycja przebiegła pomyślnie!");
                    }
                })
            })
        }


    })

})


let createNewBook = (book) => {

    // ADD BOOKS IN TABLE

    let $booksList = $('#booksList')
    let $li = $('<li>', {class: 'list-group-item'})
    let $panel = $('<div>', {class: 'panel panel-default'})
    let $heading = $('<div>', {class: 'panel-heading'})
    let $bookTitle = $('<span>', {class: 'bookTitle'})
    let $buttonRemove = $('<button class="btn btn-danger pull-right btn-xs btn-book-remove"><i class="fa fa-trash"></i></button>')
    let $buttonShowDescription = $('<button class="btn btn-primary pull-right btn-xs btn-book-show-description"><i class="fa fa-info-circle"></i></button>')
    let $bookDescription = $('<span>', {class: 'panel-body book-description'})

    $bookTitle.text(book.title)
    $bookDescription.text(book.description)
    $buttonRemove.attr('data-id', book.id)
    $buttonShowDescription.attr('data-id', book.id)

    $heading.append($bookTitle).append($buttonRemove).append($buttonShowDescription)
    $panel.append($heading).append($bookDescription)
    $li.append($panel)
    $booksList.append($li)

    // ADD BOOKS IN SELECT FORM FOR EDIT
    let $option = $('<option>', {value: book.id}).text(book.title)

    $('#bookEditSelect').append($option)


}