let tertiary_panel = $('#tertiary-panel');
let signup_form = $('#signup-form');
let departments = $('[name="departments[]"]');
let faculties = $('[name="faculties[]"]');
tertiary_panel.hide();

$(function() {
    let selectOptions = {
        includeSelectAllOption: true,
        buttonWidth: '100%',
        enableFiltering: true,
        filterPlaceholder: 'Search for something...',
        maxHeight: 200,
        onDropdownShow: function(event) {
            $(this).closest('select').css('width','500px')
        }

    };

    $('#departments').multiselect(selectOptions);
    $('#faculties').multiselect(selectOptions);

});

function selectSet(){
    $('[name="sets[]"]').val(null).trigger("change");
    let set = $('[name="set"]').val();
    let sets = [];
    
    do {
        sets.push(""+set+"");
        set++;
    }
    while (set <= year);
    sets.sort();
    $.unique(sets);
    for(i=0; i<sets.length; i++){
        $('#sets').append("<option selected='selected' value=\"" +sets[i]+"\">"+sets[i]+ "</option>");
    }
    
    console.log(sets);
}

signup_form.submit(function () {
    let password = $('[name="password"]').val();
    let password2 = $('[name="password2"]').val();
    let category = $('[name="category"]').val();

    let phone = $('[name="phone"]').val();
    if (phone.match("^0")) {
        phone = phone.replace("0", "+234");
    }
    else if (phone.match("^234")) {
        phone = phone.replace("234", "+234");
    } else{
        phone = "+234"+phone;
    }
    $('[name="phone"]').val(phone);

    // Check if empty if not
    if (password != password2) {
        $('#password_group').addClass("has-error");
        $('#password_group2').addClass("has-error");
        return false;
    }


});

$('[name="category"]').on('change', function() {
    let department = $('#departments');
    let faculty = $('#faculties');
    if(this.value == "Tertiary"){
        tertiary_panel.show();
        departments.prop('required',true);
        faculties.prop('required',true);
    }else{
        tertiary_panel.hide();
        departments.prop('required',false);
        faculties.prop('required',false);
        department.multiselect('deselectAll', false);
        faculty.multiselect('deselectAll', false);
        department.multiselect('updateButtonText');
        faculty.multiselect('updateButtonText');

    }
});

$('#add-faculty-form').submit(function () {
    let faculty_name = $('[name="faculty_name"]');
    let add_faculty_prompt = $('#add-faculty-prompt');

    $.ajax({
        method: "POST",
        url: SERVER_URL+"/api/faculty/add/",
        data: {"name": faculty_name.val()},
        success: function(data) {
            console.log(data);
            if(data.status == 'success'){
                $('#faculty_name').val("");
                add_faculty_prompt.html(data.data.name+" has been added");
                add_faculty_prompt.show();
                $('#faculties').append($('<option>', {
                    value: data.data._id,
                    text : data.data.name
                }));
                $('#faculties').multiselect('rebuild');
            }else{
                faculty_name.val("");
                add_faculty_prompt.html(data.data);
                add_faculty_prompt.show();
            }
        },
        error: function(err) {
            console.log(err);
        }
    });

    return false;
});

$('#add-dept-form').submit(function () {

    let dept_name = $('[name="dept_name"]');
    let add_dept_prompt = $('#add-dept-prompt');

    $.ajax({
        method: "POST",
        url: SERVER_URL+"/api/department/add/",
        data: {"name": dept_name.val()},
        success: function(data) {
            console.log(data);
            if(data.status == 'success'){
                add_dept_prompt.html(data.data.name+" has been added");
                add_dept_prompt.show();
                $('#departments').append($('<option>', {
                    value: data.data._id,
                    text : data.data.name
                }));
                $('#departments').multiselect('rebuild');
                dept_name.val("");
            }else{
                dept_name.val("");
                add_dept_prompt.html(data.data);
                add_dept_prompt.show();
            }
        },
        error: function(err) {
            console.log(err);
        }
    });

    return false;
});
let set = $('#set');
let time = new Date();
let year = time.getYear();
if (year < 1900) {
    year = year + 1900;
}
let date = year - 51;
let future = year + 2;
    set.append("<option>Choose Sets</option>");
do {
    date++;
    set.append("<option value=\"" +date+"\">"+date+ "</option>");
}
while (date < future)

// String.prototype.toProperCase = function () {
//     return this.replace(/\w\S*/g, function(txt){
//         return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
//     }
// };

function isNumber(event){
    var charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57))
        return false;
    return true;
}
