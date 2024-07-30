from django import forms
from django_recaptcha.fields import ReCaptchaField, ReCaptchaV2Checkbox

class SubscribeForm(forms.Form):
    email = forms.EmailField(label='Your Email',
                                  widget=forms.TextInput(
                                    attrs={
                                        'placeholder' : 'Your Email',
                                        'type' : 'email',
                                        'name' : 'email',
                                        'class': 'subscribe-input',
                                        'id' : 'subscribe-email',
                                        }
                                    ),
                                  required=True)
    
    captcha = ReCaptchaField(
        widget=ReCaptchaV2Checkbox(
            attrs={
                'data-callback': 'enableFormSubmit',
            }
        )
    )