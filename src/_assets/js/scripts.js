function multipartField() {
	let $$multipart_fields = document.querySelectorAll('.multipart_field');
	$$multipart_fields.forEach(e => {
	  const $multipart_field1 = e.querySelector('.multipart_field1');
	  const $multipart_field2 = e.querySelector('.multipart_field2');
	  const $multipart_field_result = e.querySelector('.multipart_field_result');
	  [$multipart_field1, $multipart_field2].forEach(item => {
	    item.addEventListener('keyup', event => {
	      $multipart_field_result.value = $multipart_field1.value + $multipart_field2.value;
	    });
	  })
	});
}

function preventZero() {
	// Prevent starting number with 0 +
	preventZero = e => {
	  var reg = /^0+/gi;
	  if (e.value.match(reg)) {
	      e.value = e.value.replace(reg, '');
	  }
	}
	let $$prevent_zero = document.querySelectorAll('.prevent_zero');
	$$prevent_zero.forEach(e => {
	  e.addEventListener('input', event => {
	    preventZero(e);
	  });
	  e.addEventListener('propertychange', event => {
	    preventZero(e);
	  });
	  e.addEventListener('paste', event => {
	    preventZero(e);
	  });
	});
}

function preventNonNumeric() {
	// Prevent typing non-numeric
	let $$number_only = document.querySelectorAll('.number_only');
	$$number_only.forEach(function(e) {
	  e.addEventListener("keypress", event => {
	      if (event.which < 48 || event.which > 57) {
	        event.preventDefault();
	      }
	  });
	});
}

function forcePhonePlus() {
	let $$force_plus = document.querySelectorAll('.force_plus');
	$$force_plus.forEach(e => {
		console.log('$test');

	  e.addEventListener('keyup', event => {
	    var val = e.value;
	    if(!val.match(/^\+/)) {
	      e.value = "+" + val;
	    }
	  });
	});
}

function typeSelect() {
	// Type select
	let $$type_select = document.querySelectorAll('.type_select');
	let $data_select = document.querySelector('.data-select');
	$data_select.selectedIndex = 0;
	$$type_select.forEach(e => {

	  let current_select = e;
	  current_select.addEventListener('click', event => {

	    $data_select.disabled = false;
	    $data_select.selectedIndex = 0;
	    $data_select.querySelectorAll('option[value]').forEach(e => {
	      e.style.display = 'none';
	    });
	    JSON.parse(current_select.dataset.select).forEach(e => {
	      $data_select.querySelector('option[value="' + e + '"]').style.display = 'block';
	    });
	  });
	});
}

function i18nTranslate(strings) {
	strings.forEach(function (currentUser) {
	   const strings = document.querySelector('.form').innerHTML.match(/(?<=(\[\[))([\w\s]*)(?=(\]\]))/gm);
	   strings.forEach(e => {
	     document.querySelector('.form').innerHTML = document.querySelector('.form').innerHTML.replaceAll('[['+e+']]', currentUser[e]);
	   });
	});
}

MsCrmMkt.MsCrmFormLoader.on("afterFormLoad", (e) => {
	Object.assign(strings[0], specificStrings);
	i18nTranslate(strings);
	typeSelect();
	multipartField();
	preventZero();
	preventNonNumeric();
	forcePhonePlus()
	MsCrmMkt.MsCrmFormLoader.on("formSubmit", (e) => {
		const $form = document.querySelector('.form');
		const $submit = document.querySelector('.form');
		document.querySelectorAll('[required]').forEach(e => {
			e.removeAttribute("pattern");
		});
		let fields = document.querySelectorAll('[required]');
		let $submitBtn = document.querySelector('#submit_btn');
		pristine = new Pristine($form);
		let valid = pristine.validate(fields);
		if(!valid) {
			e.preventDefault();
			// dataLayer.push({'formStatus': 'invalid'});
			console.log('invalid');
			$submitBtn.disabled = false;
			var firstError = document.querySelector('.has-danger:first-of-type');
			firstError.scrollIntoView({ behavior: 'smooth'});
		} else {
			console.log('valid');
			// dataLayer.push({'formStatus': 'valid'});
			$submitBtn.disabled = true;
			document.querySelector('.sending').classList.add('active');
		}
	});
});

MsCrmMkt.MsCrmFormLoader.on("afterFormSubmit", (e) => { 
	window.location.href = document.querySelector('#redirect').value; 
}); 
