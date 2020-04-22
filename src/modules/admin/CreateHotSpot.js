export default {
  id: 'createHotSpotModal',
  size: 'modal-md',
  title: 'Add Places',
  background: null,
  inputs: [{
    row: 'full',
    label: 'Location',
    variable: 'location',
    placeholder: 'Add Location',
    value: null,
    required: true,
    id: 'location',
    type: 'location_non_concatenated',
    inputType: 'text',
    validation: {
      size: 1,
      type: 'location_non_concatenated'
    }
  }],
  route: 'visited_places/create',
  button: {
    left: 'Cancel',
    right: 'Submit'
  },
  sort: null,
  params: []
}
