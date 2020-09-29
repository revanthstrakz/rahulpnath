import { Container } from 'components/common'
import { withFormik } from 'formik'
import addToMailchimp from 'gatsby-plugin-mailchimp'
import { ThemeContext } from 'providers/ThemeProvider'
import React, { useContext } from 'react'
import * as Yup from 'yup'
import { FormWrapper, Frame, StyledForm } from './styles'

const Wrapper = ({
  errors,
  isSubmitting,
  touched,
  values,
  handleBlur,
  handleChange,
}) => {
  const { theme } = useContext(ThemeContext)
  return (
    <FormWrapper as={Container}>
      <StyledForm theme={theme}>
        <Frame
          src="https://rahulpnath.substack.com/embed"
          frameborder="0"
          scrolling="no"
        ></Frame>
      </StyledForm>
    </FormWrapper>
  )
}

export const Subscribe = withFormik({
  mapPropsToValues: () => ({ email: '' }),
  validationSchema: () =>
    Yup.object().shape({
      email: Yup.string()
        .email('Please enter a valid email!')
        .required('Email is required!'),
    }),
  handleSubmit: async ({ email }, { setErrors, setSubmitting, setValues }) => {
    try {
      const res = await addToMailchimp(email, {
        pathname: document.location.pathname,
      })
      if (res.result === 'success') {
        setValues({ status: 'success', msg: res.msg, email })
        setSubmitting(false)
      } else {
        setValues({ status: 'error', msg: res.msg, email })
        setSubmitting(false)
      }
    } catch (err) {
      setErrors({ message: err, status: 'error' })
      setSubmitting(false)
    }
  },
})(Wrapper)
