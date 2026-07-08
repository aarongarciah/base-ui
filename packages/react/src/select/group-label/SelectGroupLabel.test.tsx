import { expect } from 'vitest';
import { Select } from '@base-ui/react/select';
import { screen } from '@mui/internal-test-utils';
import { createRenderer, describeConformance } from '#test-utils';

describe('<Select.GroupLabel />', () => {
  const { render } = createRenderer();

  describeConformance(<Select.GroupLabel />, () => ({
    refInstanceof: window.HTMLDivElement,
    render(node) {
      return render(
        <Select.Root open>
          <Select.Group>{node}</Select.Group>
        </Select.Root>,
      );
    },
  }));

  it('labels the group, and removes the association when unmounted', async () => {
    function App({ withLabel }: { withLabel: boolean }) {
      return (
        <Select.Root open>
          <Select.Portal>
            <Select.Positioner>
              <Select.Popup>
                <Select.Group data-testid="group">
                  {withLabel && <Select.GroupLabel>Fruits</Select.GroupLabel>}
                  <Select.Item value="apple">Apple</Select.Item>
                </Select.Group>
              </Select.Popup>
            </Select.Positioner>
          </Select.Portal>
        </Select.Root>
      );
    }

    const { setProps } = await render(<App withLabel />);

    const group = screen.getByTestId('group');
    const label = screen.getByText('Fruits');
    expect(group).toHaveAttribute('aria-labelledby', label.id);

    await setProps({ withLabel: false });
    expect(group).not.toHaveAttribute('aria-labelledby');
  });
});
