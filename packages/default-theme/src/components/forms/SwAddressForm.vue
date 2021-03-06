<template>
  <div class="sw-address">
    <p class="message">
      {{ $t("Keep your addresses and contact details updated.") }}
    </p>
    <SwErrorsList :list="formErrors" />
    <div class="sw-form">
      <div class="inputs-group">
        <SwInput
          v-model="address.firstName"
          name="firstName"
          :label="$t('First name')"
          :error-message="$t('First name is required')"
          :valid="!$v.address.firstName.$error"
          required
          class="sw-form__input"
          @blur="$v.address.firstName.$touch()"
        />
        <SwInput
          v-model="address.lastName"
          name="lastName"
          :label="$t('Last name')"
          :error-message="$t('Last name is required')"
          :valid="!$v.address.lastName.$error"
          required
          class="sw-form__input"
          @blur="$v.address.lastName.$touch()"
        />
      </div>
      <div class="inputs-group">
        <SfSelect
          v-model="address.salutation.value"
          :label="$t('Salutation')"
          :error-message="$t('Salutation must be selected')"
          required
          :valid="!$v.address.salutation.$error"
          class="sf-select--underlined sw-form__select sw-form__input sf-input--has-text"
          @blur="$v.address.salutation.$touch()"
        >
          <SfSelectOption
            v-for="salutationOption in getMappedSalutations"
            :key="salutationOption.id"
            :value="salutationOption"
          >
            {{ salutationOption.name }}
          </SfSelectOption>
        </SfSelect>
        <SwInput
          v-model="address.street"
          name="street"
          :label="$t('Street and house number')"
          :error-message="$t('Street is required')"
          :valid="!$v.address.street.$error"
          required
          class="sw-form__input"
          @blur="$v.address.street.$touch()"
        />
      </div>

      <div class="inputs-group">
        <SwInput
          v-model="address.city"
          name="city"
          :label="$t('City')"
          :error-message="$t('City is required')"
          :valid="!$v.address.city.$error"
          required
          class="sw-form__input"
          @blur="$v.address.city.$touch()"
        />
        <SwInput
          v-if="displayState"
          v-model="address.state"
          name="state"
          :label="$t('State/Province')"
          :error-message="$t('State is required')"
          :valid="!$v.address.state.$error"
          class="sw-form__input"
          :required="forceState"
          @blur="$v.address.state.$touch()"
        />
      </div>
      <div class="inputs-group">
        <SwInput
          v-model="address.zipcode"
          name="zipcode"
          :label="$t('Zip code')"
          :error-message="$t('Zip code is required')"
          :valid="!$v.address.zipcode.$error"
          required
          class="sw-form__input"
          @blur="$v.address.zipcode.$touch()"
        />

        <SfSelect
          v-model="address.country.value"
          :label="$t('Country')"
          :error-message="$t('Country must be selected')"
          :valid="!$v.address.country.$error"
          required
          class="sf-select--underlined sw-form__select"
          @blur="$v.address.country.$touch()"
        >
          <SfSelectOption
            v-for="countryOption in getMappedCountries"
            :key="countryOption.id"
            :value="countryOption"
          >
            {{ countryOption.name }}
          </SfSelectOption>
        </SfSelect>
      </div>
      <SwInput
        v-model="address.phoneNumber"
        name="phoneNumber"
        :label="$t('Phone number')"
        :error-message="$t('Wrong phone number')"
        :valid="!$v.address.phoneNumber.$error"
        required
        class="sw-form__input"
        @blur="$v.address.phoneNumber.$touch()"
      />

      <SwButton class="sw-form__button" @click="updateAddress">
        {{ $t("Update the address") }}
      </SwButton>
      <SwButton
        class="sf-button--outline sw-form__button sw-form__button--back"
        @click="returnToAddresses"
      >
        {{ $t("Back") }}
      </SwButton>
    </div>
  </div>
</template>

<script>
import useVuelidate from "@vuelidate/core"
import { required, requiredIf } from "@vuelidate/validators"
import { computed, reactive, ref } from "@vue/composition-api"
import { SfAlert, SfSelect } from "@storefront-ui/vue"
import {
  useCountries,
  useCountry,
  useUser,
  useSalutations,
  useNotifications,
} from "@shopware-pwa/composables"
import {
  mapCountries,
  mapSalutations,
  getMessagesFromErrorsArray,
} from "@shopware-pwa/helpers"
import SwButton from "@/components/atoms/SwButton.vue"
import SwInput from "@/components/atoms/SwInput.vue"
import SwErrorsList from "@/components/SwErrorsList.vue"

export default {
  name: "SwAddressForm",
  components: { SfAlert, SwInput, SwButton, SfSelect, SwErrorsList },
  props: {
    address: {
      type: Object,
      default: () => ({
        firstName: "",
        lastName: "",
        salutation: null,
        country: null,
        zipcode: "",
        street: "",
        city: "",
        phoneNumber: "",
      }),
    },
  },
  setup({ address }, { root }) {
    const { pushError, pushSuccess } = useNotifications(root)
    const { getSalutations } = useSalutations(root)
    const { addAddress, error: userError } = useUser(root)
    const { getCountries, error: countriesError } = useCountries(root)
    // simplify entities
    const getMappedCountries = computed(() => mapCountries(getCountries.value))
    const getMappedSalutations = computed(() =>
      mapSalutations(getSalutations.value)
    )
    // append a model
    address.salutation = ref(
      getMappedSalutations.value.find(
        (salutation) => salutation.id === address.salutationId
      )
    )
    address.country = ref(
      getMappedCountries.value.find(
        (country) => country.id === address.countryId
      )
    )
    // compute selected id
    const selectedCountryId = computed(
      () =>
        (address.country.value && address.country.value.id) || address.countryId
    )
    const selectedSalutationId = computed(
      () =>
        (address.salutation.value && address.salutation.value.id) ||
        address.salutationId
    )
    // check whether state is required
    const { displayState, forceState } = useCountry(
      selectedCountryId,
      getCountries
    )
    const formErrors = getMessagesFromErrorsArray(
      userError.value && this.userError.value.message
    )

    // address model ready to be sent to API
    const getAddressModel = computed(() => ({
      id: address._uniqueIdentifier,
      firstName: address.firstName,
      lastName: address.lastName,
      zipcode: address.zipcode,
      street: address.street,
      city: address.city,
      phoneNumber: address.phoneNumber,
      countryId: selectedCountryId.value,
      salutationId: selectedSalutationId.value,
    }))

    // try to save an address
    const saveAddress = () => addAddress(getAddressModel.value)

    return {
      addAddress,
      userError,
      countriesError,
      getMappedCountries,
      getMappedSalutations,
      displayState,
      forceState,
      saveAddress,
      pushError,
      pushSuccess,
      formErrors,
      $v: useVuelidate(),
    }
  },
  methods: {
    async updateAddress() {
      this.$v.$touch()
      if (this.$v.$invalid) {
        return
      }
      await this.saveAddress()
      if (this.userError) {
        return this.pushError(
          this.$t("Your address couldn't be updated due to some errors")
        )
      }

      this.pushSuccess(this.$t("Your address has been updated"))
      this.returnToAddresses()
    },
    returnToAddresses() {
      this.$router.push(this.$routing.getUrl("/account/addresses"))
    },
  },
  validations: {
    address: {
      lastName: {
        required,
      },
      firstName: {
        required,
      },
      salutation: {
        required,
      },
      street: {
        required,
      },
      city: {
        required,
      },
      state: {
        required: requiredIf(function () {
          return this.forceState
        }),
      },
      zipcode: {
        required,
      },
      country: {
        required,
      },
      phoneNumber: {
        required,
      },
    },
  },
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/forms";
</style>
