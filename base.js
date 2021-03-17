jQuery.extend(jQuery.expr[':'], {
  shown: function (el, index, selector) {
    return $(el).css('visibility') != 'hidden' && $(el).css('display') != 'none' && !$(el).is(':hidden')
  }
});

function isCollection() {
  return window.location.href.includes('/collection');
}

let materialIndex = 0;
let printIndex = 1;
let material_template = '';
let board = '';
let tube = '';
let box = '';

if ($(`.hb-material-board-wrapper`).length > 0) {
  if (isCollection()) {
    board = $(`.hb-collection-materials .hb-material-board-wrapper`)[0].innerHTML;
  } else {
    $(`[for="ship_materials__0__board"]`).attr('for', `materials__0__board`);
    $(`[name="ship_materials__0__board"]`).attr('id', `materials__0__board`).attr('name', `materials__0__board`).attr('data-name', 'materials__0__board');

    board = $(`.hb-shipping-materials .hb-material-board-wrapper`)[0].innerHTML;
  }

  tube = $(`.hb-material-tube-wrapper`)[0].innerHTML;
  box = $(`.hb-material-box-wrapper`)[0].innerHTML;
}

function orderPackaging(show) {
  if (show) {
    $('.hb-materials').show();
    $('.hb-add-packaging-wrapper').show();
  	createMaterialElement();
  } else {
    $('.hb-materials').hide();
  	$('.hb-materials').children('.hb-material').remove();
    $('.hb-add-packaging-wrapper').hide();
  }
}

function buildMaterialTemplate() {
  if ($('.hb-materials').children().first().length > 0) {
    if (isCollection()) {
      $('.hb-shipping-materials').remove();
      $('.hb-collection-materials').addClass('show');
    } else {
      $('.hb-shipping-materials').addClass('show');
      $('.hb-collection-materials').remove();
    }

    material_template = $('.hb-materials').children().first()[0].innerHTML;
    material_template = material_template.replaceAll('ship_materials', 'materials');
    $('.hb-materials').children().first().remove();
  }
}

function createPackagingOptions(packagingOptions, index) {
	return packagingOptions.replaceAll('__0__', `__${index}__`);
}

function createMaterialElement() {
  let id = `hb-material-${materialIndex}`;
  let template = material_template.replaceAll('__0__', `__${materialIndex}__`);

  let container = $('.hb-materials').first()[0];
  let div = document.createElement('div');
  div.innerHTML = template;
  div.classList.add('hb-material');
  div.id = `${id}`;
  $('.hb-material').addClass('hb-collapsed');
  container.appendChild(div);

  hideMaterialSelection(materialIndex);
  setupMaterialListeners(materialIndex);
  $(`#${id} .hb-material-name`).text(setMaterialName(materialIndex));
  materialIndex++;
}

function setMaterialName(index) {
  let packaging = $(`[name="materials__${index}__packaging"]`).val();
  if (packaging === "Backing Board") {
    let board = $(`[name="materials__${index}__board"]`).val();
    return `${packaging} - ${board}`;
  } else if (packaging === "Mailer Tube") {
    let tube = $(`[name="materials__${index}__tube"]`).val();
    return `${packaging} - ${tube}`;
  } else if (packaging === "Mailer Boxes") {
    let boxes = $(`[name="materials__${index}__box"]`).val();
    return `${packaging} - ${boxes}`;
  }
  return packaging;
}

function hideMaterialSelection(index) {
  let id = `hb-material-${index}`;
  let packaging = $(`[name="materials__${index}__packaging"]`).val();

  let boardWrapper = $(`#${id} .hb-material-board-wrapper`);
  let tubeWrapper = $(`#${id} .hb-material-tube-wrapper`);
  let boxWrapper = $(`#${id} .hb-material-box-wrapper`);

  if (packaging === "Backing Board") {
    boardWrapper[0].innerHTML = createPackagingOptions(board, index);
    boardWrapper.show();
    hideAndRemoveChildren(tubeWrapper);
    hideAndRemoveChildren(boxWrapper);
  } else if (packaging === "Mailer Tube") {
    hideAndRemoveChildren(boardWrapper);
    tubeWrapper[0].innerHTML = createPackagingOptions(tube, index);
    tubeWrapper.show();
    hideAndRemoveChildren(boxWrapper);
  } else if (packaging === "Mailer Boxes") {
    hideAndRemoveChildren(boardWrapper);
    hideAndRemoveChildren(tubeWrapper);
    boxWrapper[0].innerHTML = createPackagingOptions(box, index);
    boxWrapper.show();

  } else {
    hideAndRemoveChildren(boardWrapper);
    hideAndRemoveChildren(tubeWrapper);
    hideAndRemoveChildren(boxWrapper);
  }

  $(`[name="materials__${index}__board"]`).on('change', function() {
    $(`#${id} .hb-material-name`).text(setMaterialName(index));
  });

  $(`[name="materials__${index}__tube"]`).on('change', function() {
    $(`#${id} .hb-material-name`).text(setMaterialName(index));
  });

  $(`[name="materials__${index}__box"]`).on('change', function() {
    $(`#${id} .hb-material-name`).text(setMaterialName(index));
  });
}

function hideAndRemoveChildren($el) {
  $el.hide();
	$el.children().remove();
}

function setupMaterialListeners(index) {
  let id = `hb-material-${index}`;

  $(`#${id} .hb-material-collapsed-expand`).on('click', function() {
    $(`.hb-material:not(#${id})`).addClass('hb-collapsed');
    $(`#${id}`).removeClass('hb-collapsed');
  });

  $(`#${id} .hb-material-collapsed-name`).on('click', function() {
    $(`.hb-material:not(#${id})`).addClass('hb-collapsed');
    $(`#${id}`).removeClass('hb-collapsed');
  });

  $(`[name="materials__${index}__packaging"]`).on('change', function() {
    $(`#${id} .hb-material-name`).text(setMaterialName(index));
    hideMaterialSelection(index);
  });

  $(`[name="materials__${index}__board"]`).on('change', function() {
    $(`#${id} .hb-material-name`).text(setMaterialName(index));
  });

  $(`[name="materials__${index}__tube"]`).on('change', function() {
    $(`#${id} .hb-material-name`).text(setMaterialName(index));
  });

  $(`[name="materials__${index}__box"]`).on('change', function() {
    $(`#${id} .hb-material-name`).text(setMaterialName(index));
  });

  $(`[name="materials__${index}__quantity"]`).on('change', function() {
    $(`#${id} .hb-material-quantity`).text($(`[name="materials__${index}__quantity"]`).val());
  });

  $(`#${id} .hb-material-collapsed-remove`).on('click', function() {
    $(`#${id}`).remove();
  });
}

function setupPrintListeners(index) {
  let id = `hb-print-${index}`;
  $(`#${id} .hb-print-collapsed-expand`).on('click', function() {
    $(`.hb-print:not(#${id})`).addClass('hb-collapsed');
    $(`#${id}`).removeClass('hb-collapsed');
  });
  $(`#${id} .hb-print-collapsed-name`).on('click', function() {
    $(`.hb-print:not(#${id})`).addClass('hb-collapsed');
    $(`#${id}`).removeClass('hb-collapsed');
  });
  $(`[name="prints__${index}__file_name"]`).on('change', function() {
    $(`#${id} .hb-print-collapsed-name`).text($(`[name="prints__${index}__file_name"]`).val());
  });
  $(`#${id} .hb-print-collapsed-remove`).on('click', function() {
    $(`#${id}`).remove();
  });
}

function setupOrderPackagingListener() {
  $('[name="packaging_materials"]').on('change', function(event) {
    let show = event.target.value === "Yes";
    orderPackaging(show);
  });
}

if ($('.hb-materials').children().first().length > 0) {
  setupOrderPackagingListener();
  buildMaterialTemplate();
  orderPackaging(false);
}

$('#add-new-packaging').on('click', function () {
  createMaterialElement();
});

setupPrintListeners(0);
let original_template = '';
if ($('.hb-prints').children().first().length > 0) {
   original_template = $('.hb-prints').children().first()[0].innerHTML;
}

$('#add-new-print').on('click', function () {
  let id = `hb-print-${printIndex}`;
  let template = original_template.replaceAll('__0__', `__${printIndex}__`);

  let container = $('.hb-prints').first()[0];
  let div = document.createElement('div');
  div.innerHTML = template;
  div.classList.add('hb-print');
  div.id = `${id}`;
  $('.hb-print').addClass('hb-collapsed');
  container.appendChild(div);

  setupPrintListeners(printIndex);

  printIndex++;
});

$('.hb-shipping-info #postal_method').on('change', function() {
  let value = $('.hb-shipping-info #postal_method').val();
  if (value === 'International') {
    $('.hb-international-shipping').show();
  } else {
    $('.hb-international-shipping').hide();
  }
});

function disableFormBtn(valid) {
  if (valid) {
    $('.hb-next-btn').removeClass('disabled')
    $('.hb-next-btn').prop('disabled', false);
    $('.hb-required-error').css('visibility', 'hidden');
    disabled = false;
  } else {
    $('.hb-next-btn').addClass('disabled')
    $('.hb-next-btn').prop('disabled', true);
    $('.hb-required-error').css('visibility', 'visible');
    if (!disabled) {
      disabled = true;
      $('.hb-form-content').animate({ scrollTop: 0 }, 500);
    }
  }
}

function isValidForm($el) {
  var valid = true;
  $el.find('input,textarea,select').filter('[required]').each(function() {
    var isValid = $(this).is('input[type="checkbox"]') ? $(this).is(':checked') : ($(this).val() != null && $(this).val() != '');
    if (!isValid) {
      $(this).addClass('is-error');
    } else {
      $(this).removeClass('is-error');
    }
    valid = valid && isValid;
  });
  if ($el.find('.hb-prints').length > 0) {
    var hasPrints = $el.find('.hb-print').length > 0;
    valid = valid && hasPrints;
  }
  if ($el.find('input[name="packaging_materials"]') && $el.find('input#Yes[name="packaging_materials"]').is(':checked')) {
    var hasPackaging = $el.find('.hb-material').length > 0;
    valid = valid && hasPackaging;
  }
  return valid;
}

// Setup form to not show the errors until submitted.
var submitted = false;
var disabled = false;

$('.hb-required-error').css('visibility', 'hidden');

$('.hb-collaborate-form-step').find('input,textarea,select').filter('[required]').on('change', function() {
  var formStep = $(this).parents('.hb-collaborate-form-step');
  var valid = isValidForm(formStep);
  if (submitted) {
    disableFormBtn(valid);
  }
});

$('.hb-next-btn').click(function() {
  var valid = isValidForm($('.hb-collaborate-form-step:shown'));
  disableFormBtn(valid);
  submitted = !valid;
  return valid;
});

$(".paper-select-field.box-size-select-field.board-select-field.tube-select-field.packaging-select-field").each(function(){
 $(this).children().first().attr("disabled","disabled");
});
