var editor;
var resource_form;
var resource_body_element;
var auto_save_url = null;
var auto_save_timer;

$(function() {
	initializeEditor('editor');

	$('input[type="button"][data-action="save"]').click(save);
	$('input[type="button"][data-action="unpublish"]').click(unpublish);
	$('input[type="button"][data-action="save_and_publish"]').click(saveAndPublish);


	//editor.getSession().on('change', updatePreview);
	editor.getSession().on('change', beginAutoSave);
		
	updatePreview();
});
	
function initializeEditor(element_id) {
	editor = ace.edit(element_id);
	editor.getSession().setUseWrapMode(true);
		
	var MarkdownMode = require("ace/mode/markdown").Mode;
	editor.getSession().setMode(new MarkdownMode());
}

function updatePreview() {
	if ($('#ResourcePreview_Body')) {
		//$('#ResourcePreview_Body').html();
	}
}

	
function save(e) {
	resource_body_element.val(editor.getValue());
	$('input#resource_action').val('save');
	resource_form.submit();
}
	
function unpublish(e) {
	resource_body_element.val(editor.getValue());
	$('input#resource_action').val('unpublish');
	resource_form.submit();
}
	
function saveAndPublish(e) {
	resource_body_element.val(editor.getValue());
	$('input#resource_action').val('publish');
	resource_form.submit();
}

function beginAutoSave() {
	window.clearTimeout(auto_save_timer);

	auto_save_timer = window.setTimeout(autoSave, 2500);
}	

function autoSave() {
	if (auto_save_url != null) {
		resource_body_element.val(editor.getValue());
		$('input#resource_action').val('autosave');

		$.ajax({
			url: auto_save_url,
			type: 'post',
			data: resource_form.serialize(),
			dataType: 'json',
			success: function(data, textStatus, jqXHR) {
				$('#save_notice').show();

				window.setTimeout(function() {
					$('#save_notice').fadeOut('fast');
				}, 2000);
			}
		});
	}
}